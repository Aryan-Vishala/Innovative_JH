const Problem = require('../models/Problem');
const Organization = require('../models/Organization');
const { generateProblemId } = require('../services/problemIdGenerator');
const { analyzeProblem } = require('../services/aiTriageService');

// @desc    Submit a new problem (Citizen 4-Step Wizard)
// @route   POST /api/v1/problems
// @access  Private (Citizen)
const createProblem = async (req, res) => {
  try {
    const {
      title,
      description,
      category,
      district,
      block,
      panchayat = '',
      village = '',
      latitude = null,
      longitude = null,
      estimatedPopulation = 0,
      frequency = 'Daily',
      citizenReportedSeverity = 'Medium',
      evidenceCaption = '',
    } = req.body;

    const resolvedBlock = (block && block.trim()) || 'Central Block';

    if (!title || !description || !category || !district) {
      return res.status(400).json({
        success: false,
        message: 'Title, description, category, and district are required',
      });
    }

    const problemId = await generateProblemId();

    // Process uploaded evidence files
    const evidence = [];
    if (req.files && req.files.length > 0) {
      req.files.forEach((file) => {
        let fileType = 'document';
        if (file.mimetype.startsWith('image/')) fileType = 'image';
        else if (file.mimetype.startsWith('video/')) fileType = 'video';

        evidence.push({
          fileUrl: `/uploads/${file.filename}`,
          fileType,
          originalName: file.originalname,
          caption: evidenceCaption || file.originalname,
          uploadedAt: new Date(),
        });
      });
    }

    const initialTimeline = [
      {
        stage: 'SUBMITTED',
        description: `Problem reported by ${req.user.name || 'Citizen'} in ${district}, Block: ${resolvedBlock}`,
        updatedBy: req.user._id,
        updaterName: req.user.name || 'Citizen',
        timestamp: new Date(),
      },
    ];

    // Run AI Triage & Matcher (FastAPI microservice or fallback engine)
    let aiAnalysis = null;
    try {
      const triageResult = await analyzeProblem({
        title,
        description,
        category,
        district,
      });
      if (triageResult && triageResult.data) {
        aiAnalysis = {
          ...triageResult.data,
          analyzedAt: new Date(),
        };
      }
    } catch (aiErr) {
      console.warn('AI Triage processing warning:', aiErr.message);
    }

    const problem = await Problem.create({
      problemId,
      title,
      description,
      category,
      createdBy: req.user._id,
      submitterName: req.user.name || 'Citizen',
      location: {
        district,
        block: resolvedBlock,
        panchayat,
        village,
        coordinates: {
          latitude: latitude ? parseFloat(latitude) : null,
          longitude: longitude ? parseFloat(longitude) : null,
        },
      },
      evidence,
      impact: {
        estimatedPopulation: parseInt(estimatedPopulation, 10) || 0,
        frequency,
        citizenReportedSeverity,
      },
      aiAnalysis,
      status: 'SUBMITTED',
      assignedTo: `${district} Local PRI / ULB`,
      timeline: initialTimeline,
    });

    res.status(201).json({
      success: true,
      message: 'Problem submitted successfully',
      data: problem,
    });
  } catch (error) {
    console.error('Error submitting problem:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get all problems (with query filters & search)
// @route   GET /api/v1/problems
// @access  Public
const getProblems = async (req, res) => {
  try {
    const {
      status,
      category,
      district,
      search,
      verifiedOnly,
      level,
      page = 1,
      limit = 20,
    } = req.query;

    const query = {};

    if (verifiedOnly === 'true') {
      query.status = {
        $in: [
          'PRI_VERIFIED',
          'NODAL_REVIEWED',
          'MASTER_PROBLEM_CREATED',
          'SOLUTION_IN_PROGRESS',
          'PROTOTYPE_READY',
          'PILOT_TESTING',
          'DEPLOYED',
        ],
      };
    } else if (status && status !== 'All') {
      query.status = status;
    }

    if (level && level !== 'All') {
      query['solution.level'] = parseInt(level, 10);
    }

    if (category && category !== 'All') {
      query.category = category;
    }
    if (district && district !== 'All') {
      query['location.district'] = new RegExp(district, 'i');
    }
    if (search) {
      query.$or = [
        { title: new RegExp(search, 'i') },
        { description: new RegExp(search, 'i') },
        { problemId: new RegExp(search, 'i') },
        { 'location.block': new RegExp(search, 'i') },
        { 'location.panchayat': new RegExp(search, 'i') },
      ];
    }

    const skip = (parseInt(page, 10) - 1) * parseInt(limit, 10);
    const total = await Problem.countDocuments(query);
    const problems = await Problem.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit, 10))
      .populate('createdBy', 'name email mobile');

    res.status(200).json({
      success: true,
      count: problems.length,
      total,
      page: parseInt(page, 10),
      pages: Math.ceil(total / parseInt(limit, 10)),
      data: problems,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get Public Analytical Dashboard KPIs & Distributions
// @route   GET /api/v1/problems/public-analytics
// @access  Public
const getPublicAnalytics = async (req, res) => {
  try {
    const totalProblems = await Problem.countDocuments();
    const [activeProjects, universities, statusAggregation] = await Promise.all([
      Problem.countDocuments({
        status: { $in: ['SOLUTION_IN_PROGRESS', 'PROTOTYPE_READY', 'PILOT_TESTING'] },
      }),
      Organization.countDocuments({
        type: { $in: ['nodal_hei', 'participating_hei'] },
      }),
      Problem.aggregate([
        { $group: { _id: '$status', count: { $sum: 1 } } },
      ]),
    ]);

    const countsByStatus = statusAggregation.reduce((counts, item) => {
      counts[item._id] = item.count;
      return counts;
    }, {});
    const statusCounts = {
      submitted: (countsByStatus.SUBMITTED || 0) +
        (countsByStatus.AI_CLASSIFIED || 0) +
        (countsByStatus.PRI_VERIFICATION_PENDING || 0),
      underReview: (countsByStatus.PRI_VERIFIED || 0) +
        (countsByStatus.NODAL_REVIEWED || 0) +
        (countsByStatus.MASTER_PROBLEM_CREATED || 0),
      inProgress: (countsByStatus.SOLUTION_IN_PROGRESS || 0) +
        (countsByStatus.PROTOTYPE_READY || 0) +
        (countsByStatus.PILOT_TESTING || 0),
      resolved: countsByStatus.DEPLOYED || 0,
      rejected: countsByStatus.REJECTED || 0,
    };

    const now = new Date();
    const analyticsWindowStart = new Date(Date.UTC(
      now.getUTCFullYear(),
      now.getUTCMonth() - 5,
      1
    ));
    const monthlyAggregation = await Problem.aggregate([
      { $match: { createdAt: { $gte: analyticsWindowStart } } },
      {
        $group: {
          _id: {
            $dateToString: { format: '%Y-%m', date: '$createdAt', timezone: 'UTC' },
          },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);
    const monthlyCounts = new Map(monthlyAggregation.map((item) => [item._id, item.count]));
    const monthlySubmissions = Array.from({ length: 6 }, (_, index) => {
      const month = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() - 5 + index, 1));
      const key = `${month.getUTCFullYear()}-${String(month.getUTCMonth() + 1).padStart(2, '0')}`;
      return {
        month: month.toLocaleString('en-US', { month: 'short', timeZone: 'UTC' }),
        count: monthlyCounts.get(key) || 0,
      };
    });

    const verifiedProblems = await Problem.countDocuments({
      status: {
        $in: [
          'PRI_VERIFIED',
          'NODAL_REVIEWED',
          'MASTER_PROBLEM_CREATED',
          'SOLUTION_IN_PROGRESS',
          'PROTOTYPE_READY',
          'PILOT_TESTING',
          'DEPLOYED',
        ],
      },
    });

    const universityAdopted = await Problem.countDocuments({
      status: {
        $in: [
          'NODAL_REVIEWED',
          'MASTER_PROBLEM_CREATED',
          'SOLUTION_IN_PROGRESS',
          'PROTOTYPE_READY',
          'PILOT_TESTING',
          'DEPLOYED',
        ],
      },
    });

    const prototypeCreated = await Problem.countDocuments({
      status: { $in: ['PROTOTYPE_READY', 'PILOT_TESTING', 'DEPLOYED'] },
    });

    const fieldTesting = await Problem.countDocuments({
      status: { $in: ['PILOT_TESTING', 'DEPLOYED'] },
    });

    const deployedSolutions = await Problem.countDocuments({
      status: 'DEPLOYED',
    });

    // Sum estimated beneficiaries
    const impactAgg = await Problem.aggregate([
      {
        $group: {
          _id: null,
          totalBeneficiaries: { $sum: '$impact.estimatedPopulation' },
        },
      },
    ]);
    const totalBeneficiaries = impactAgg[0]?.totalBeneficiaries || 0;

    // Categories breakdown
    const categoryAgg = await Problem.aggregate([
      {
        $group: {
          _id: '$category',
          count: { $sum: 1 },
          verifiedCount: {
            $sum: {
              $cond: [
                {
                  $in: [
                    '$status',
                    [
                      'PRI_VERIFIED',
                      'NODAL_REVIEWED',
                      'MASTER_PROBLEM_CREATED',
                      'SOLUTION_IN_PROGRESS',
                      'PROTOTYPE_READY',
                      'PILOT_TESTING',
                      'DEPLOYED',
                    ],
                  ],
                },
                1,
                0,
              ],
            },
          },
        },
      },
      { $sort: { count: -1 } },
    ]);

    // District breakdown
    const districtAgg = await Problem.aggregate([
      {
        $group: {
          _id: '$location.district',
          count: { $sum: 1 },
          verifiedCount: {
            $sum: {
              $cond: [
                {
                  $in: [
                    '$status',
                    [
                      'PRI_VERIFIED',
                      'NODAL_REVIEWED',
                      'MASTER_PROBLEM_CREATED',
                      'SOLUTION_IN_PROGRESS',
                      'PROTOTYPE_READY',
                      'PILOT_TESTING',
                      'DEPLOYED',
                    ],
                  ],
                },
                1,
                0,
              ],
            },
          },
        },
      },
      { $sort: { count: -1 } },
    ]);

    // Level breakdown
    const levelCounts = {
      1: verifiedProblems,
      2: universityAdopted,
      3: prototypeCreated,
      4: fieldTesting,
      5: deployedSolutions,
    };

    res.status(200).json({
      success: true,
      data: {
        kpis: {
          totalReported: totalProblems,
          activeProjects,
          universities,
          resolved: deployedSolutions,
          verified: verifiedProblems,
          universityAdopted,
          prototypeReady: prototypeCreated,
          fieldTesting,
          deployed: deployedSolutions,
          totalBeneficiaries,
        },
        statusCounts,
        monthlySubmissions,
        levels: levelCounts,
        categories: categoryAgg.map((c) => ({
          name: c._id || 'Other',
          total: c.count,
          verified: c.verifiedCount,
        })),
        districts: districtAgg.map((d) => ({
          district: d._id || 'Jharkhand',
          total: d.count,
          verified: d.verifiedCount,
        })),
      },
    });
  } catch (error) {
    console.error('Error in getPublicAnalytics:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get my reported problems
// @route   GET /api/v1/problems/my-submissions
// @access  Private (Citizen)
const getMySubmissions = async (req, res) => {
  try {
    const problems = await Problem.find({ createdBy: req.user._id }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: problems.length,
      data: problems,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get problem by ID or problemId (e.g. JH-000001)
// @route   GET /api/v1/problems/:id
// @access  Public
const getProblemById = async (req, res) => {
  try {
    const { id } = req.params;
    let problem;

    if (id.startsWith('JH-')) {
      problem = await Problem.findOne({ problemId: id })
        .populate('createdBy', 'name email mobile location')
        .populate('priVerification.verifiedBy', 'name email mobile primaryRole')
        .populate('nodalReview.reviewedBy', 'name email primaryRole')
        .populate('nodalReview.nodalOrgId', 'name domains');
    } else {
      problem = await Problem.findById(id)
        .populate('createdBy', 'name email mobile location')
        .populate('priVerification.verifiedBy', 'name email mobile primaryRole')
        .populate('nodalReview.reviewedBy', 'name email primaryRole')
        .populate('nodalReview.nodalOrgId', 'name domains');
    }

    if (!problem) {
      return res.status(404).json({ success: false, message: 'Problem not found' });
    }

    res.status(200).json({
      success: true,
      data: problem,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Live AI Triage & Matcher Preview Endpoint (Called while citizen types)
// @route   POST /api/v1/problems/ai-triage
// @access  Public
const getAiTriage = async (req, res) => {
  try {
    const { title, description, category, district } = req.body;
    if (!title && !description) {
      return res.status(400).json({ success: false, message: 'Title or description required for AI triage' });
    }
    const result = await analyzeProblem({ title, description, category, district });
    res.status(200).json({
      success: true,
      source: result.source,
      data: result.data,
    });
  } catch (error) {
    console.error('Error in getAiTriage:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Community Upvote ("I Am Also Affected")
// @route   POST /api/v1/problems/:id/upvote
// @access  Private (Citizen, Any authenticated user)
const upvoteProblem = async (req, res) => {
  try {
    const { id } = req.params;
    const problem = await Problem.findOne({
      $or: [{ problemId: id }, { _id: id.match(/^[0-9a-fA-F]{24}$/) ? id : null }],
    });

    if (!problem) {
      return res.status(404).json({ success: false, message: 'Problem not found' });
    }

    if (!problem.communityUpvotes) {
      problem.communityUpvotes = { count: 0, upvotedBy: [] };
    }

    const userId = req.user._id.toString();
    const existingIndex = problem.communityUpvotes.upvotedBy.findIndex(
      (u) => u.toString() === userId
    );

    let hasUpvoted = false;
    if (existingIndex > -1) {
      // Toggle off
      problem.communityUpvotes.upvotedBy.splice(existingIndex, 1);
      problem.communityUpvotes.count = Math.max(0, problem.communityUpvotes.count - 1);
    } else {
      // Toggle on
      problem.communityUpvotes.upvotedBy.push(req.user._id);
      problem.communityUpvotes.count = (problem.communityUpvotes.count || 0) + 1;
      hasUpvoted = true;
    }

    await problem.save();

    res.status(200).json({
      success: true,
      count: problem.communityUpvotes.count,
      hasUpvoted,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Adopt Problem for Student R&D / Project (University Portal)
// @route   POST /api/v1/problems/:id/adopt
// @access  Private (University / Participating HEI / Nodal / Admin)
const adoptProblem = async (req, res) => {
  try {
    const { id } = req.params;
    const { facultyPi, studentTeam = [], projectTitle } = req.body;

    const problem = await Problem.findOne({
      $or: [{ problemId: id }, { _id: id.match(/^[0-9a-fA-F]{24}$/) ? id : null }],
    });

    if (!problem) {
      return res.status(404).json({ success: false, message: 'Problem not found' });
    }

    const orgName = req.user.organizationName || 'University Innovation Lab';

    problem.adoption = {
      isAdopted: true,
      adoptedByOrg: req.user.organizationId || null,
      orgName,
      facultyPi: facultyPi || req.user.name,
      studentTeam: Array.isArray(studentTeam) ? studentTeam : [studentTeam],
      projectTitle: projectTitle || `R&D: ${problem.title}`,
      adoptedAt: new Date(),
    };

    problem.solution = {
      ...problem.solution,
      universityName: orgName,
      facultyLead: facultyPi || req.user.name,
      solutionTitle: projectTitle || `R&D: ${problem.title}`,
      level: 2, // Level 2: University Adopted
      levelTag: 'University Adopted',
    };

    problem.status = 'SOLUTION_IN_PROGRESS';
    problem.assignedTo = `${orgName} (Faculty Lead: ${facultyPi || req.user.name})`;

    problem.timeline.push({
      stage: 'SOLUTION_IN_PROGRESS',
      description: `Adopted by ${orgName} as Student R&D Project "${projectTitle || problem.title}". Faculty PI: ${facultyPi || req.user.name}`,
      updatedBy: req.user._id,
      updaterName: req.user.name,
      timestamp: new Date(),
    });

    await problem.save();

    res.status(200).json({
      success: true,
      message: 'Problem adopted successfully for university R&D',
      data: problem,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Pledge CSR Support / Resources (Industry Portal)
// @route   POST /api/v1/problems/:id/pledge
// @access  Private (Industry / Admin)
const pledgeProblem = async (req, res) => {
  try {
    const { id } = req.params;
    const { resourceType = 'Funding', pledgeDetails, amount = 0 } = req.body;

    const problem = await Problem.findOne({
      $or: [{ problemId: id }, { _id: id.match(/^[0-9a-fA-F]{24}$/) ? id : null }],
    });

    if (!problem) {
      return res.status(404).json({ success: false, message: 'Problem not found' });
    }

    const orgName = req.user.organizationName || 'Industry Partner';

    const newPledge = {
      industryOrg: req.user.organizationId || null,
      orgName,
      pledgedBy: req.user._id,
      pledgerName: req.user.name,
      resourceType,
      pledgeDetails: pledgeDetails || `${resourceType} support committed`,
      amount: Number(amount) || 0,
      pledgedAt: new Date(),
    };

    if (!problem.pledges) {
      problem.pledges = [];
    }
    problem.pledges.push(newPledge);

    problem.timeline.push({
      stage: 'INDUSTRY_PLEDGED',
      description: `Support pledged by ${orgName}: ${resourceType} ${amount ? `(₹${amount})` : ''} - "${pledgeDetails}"`,
      updatedBy: req.user._id,
      updaterName: req.user.name,
      timestamp: new Date(),
    });

    await problem.save();

    res.status(200).json({
      success: true,
      message: 'Industry resource pledge registered successfully',
      data: problem,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  createProblem,
  getProblems,
  getPublicAnalytics,
  getMySubmissions,
  getProblemById,
  getAiTriage,
  upvoteProblem,
  adoptProblem,
  pledgeProblem,
};
