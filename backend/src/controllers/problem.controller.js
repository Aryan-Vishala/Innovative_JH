const Problem = require('../models/Problem');
const { generateProblemId } = require('../services/problemIdGenerator');

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

    if (!title || !description || !category || !district || !block) {
      return res.status(400).json({
        success: false,
        message: 'Title, description, category, district, and block are required',
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
        description: `Problem reported by ${req.user.name || 'Citizen'} in ${district}, Block: ${block}`,
        updatedBy: req.user._id,
        updaterName: req.user.name || 'Citizen',
        timestamp: new Date(),
      },
    ];

    const problem = await Problem.create({
      problemId,
      title,
      description,
      category,
      createdBy: req.user._id,
      submitterName: req.user.name || 'Citizen',
      location: {
        district,
        block,
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
      page = 1,
      limit = 20,
    } = req.query;

    const query = {};

    if (status && status !== 'All') {
      query.status = status;
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

module.exports = {
  createProblem,
  getProblems,
  getMySubmissions,
  getProblemById,
};
