const Problem = require('../models/Problem');
const Organization = require('../models/Organization');

// @desc    Get Nodal Intake Problems (Verified by PRI)
// @route   GET /api/v1/nodal/problems
// @access  Private (Nodal, Admin)
const getNodalProblems = async (req, res) => {
  try {
    const { domain, status } = req.query;

    const filter = {
      status: status || { $in: ['PRI_VERIFIED', 'NODAL_REVIEWED', 'MASTER_PROBLEM_CREATED'] },
    };

    if (domain && domain !== 'All') {
      filter.category = domain;
    }

    const problems = await Problem.find(filter)
      .sort({ createdAt: -1 })
      .populate('createdBy', 'name email mobile')
      .populate('priVerification.verifiedBy', 'name email');

    res.status(200).json({
      success: true,
      count: problems.length,
      data: problems,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get Nodal Dashboard Stats (by domain)
// @route   GET /api/v1/nodal/stats
// @access  Private (Nodal, Admin)
const getNodalStats = async (req, res) => {
  try {
    const verifiedProblems = await Problem.find({
      status: { $in: ['PRI_VERIFIED', 'NODAL_REVIEWED', 'MASTER_PROBLEM_CREATED'] },
    });

    const domainBreakdown = {};
    verifiedProblems.forEach((p) => {
      domainBreakdown[p.category] = (domainBreakdown[p.category] || 0) + 1;
    });

    const masterProblemsCreated = verifiedProblems.filter(
      (p) => p.status === 'MASTER_PROBLEM_CREATED'
    ).length;

    res.status(200).json({
      success: true,
      data: {
        totalVerified: verifiedProblems.length,
        masterProblemsCreated,
        pendingReview: verifiedProblems.filter((p) => p.status === 'PRI_VERIFIED').length,
        domainBreakdown,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Review and classify problem / convert to Master Problem
// @route   PATCH /api/v1/problems/:id/nodal-review
// @access  Private (Nodal, Admin)
const reviewProblem = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      action = 'ACCEPTED',
      confirmedDomain,
      confirmedSeverity,
      masterProblemTitle,
      remarks = '',
    } = req.body;

    let problem;
    if (id.startsWith('JH-')) {
      problem = await Problem.findOne({ problemId: id });
    } else {
      problem = await Problem.findById(id);
    }

    if (!problem) {
      return res.status(404).json({ success: false, message: 'Problem not found' });
    }

    const orgName = req.user.organizationName || 'Nodal HEI';
    const masterProblemId =
      action === 'CONVERTED_TO_MASTER'
        ? `JH-${(confirmedDomain || problem.category).slice(0, 3).toUpperCase()}-${new Date().getFullYear()}-${String(
            Math.floor(Math.random() * 900) + 100
          )}`
        : '';

    problem.nodalReview = {
      reviewedBy: req.user._id,
      reviewerName: req.user.name,
      nodalOrgId: req.user.organizationId || null,
      reviewedAt: new Date(),
      confirmedDomain: confirmedDomain || problem.category,
      confirmedSeverity: confirmedSeverity || problem.impact.citizenReportedSeverity,
      action,
      masterProblemId,
      remarks: remarks || '',
    };

    if (action === 'CONVERTED_TO_MASTER') {
      problem.status = 'MASTER_PROBLEM_CREATED';
      problem.assignedTo = `${orgName} (Master Problem: ${masterProblemId})`;
      problem.timeline.push({
        stage: 'MASTER_PROBLEM_CREATED',
        description: `Adopted by ${orgName} as Master Problem: ${masterProblemId} - "${masterProblemTitle || problem.title}"`,
        updatedBy: req.user._id,
        updaterName: req.user.name,
        timestamp: new Date(),
      });
    } else if (action === 'ACCEPTED') {
      problem.status = 'NODAL_REVIEWED';
      problem.assignedTo = `${orgName} (In Review)`;
      problem.timeline.push({
        stage: 'NODAL_REVIEWED',
        description: `Reviewed and confirmed by ${orgName}. Ready for solution orchestration.`,
        updatedBy: req.user._id,
        updaterName: req.user.name,
        timestamp: new Date(),
      });
    } else {
      problem.status = 'REJECTED';
      problem.assignedTo = 'Closed / Nodal Rejected';
      problem.timeline.push({
        stage: 'REJECTED',
        description: `Rejected during Nodal Review by ${orgName}. Reason: ${remarks}`,
        updatedBy: req.user._id,
        updaterName: req.user.name,
        timestamp: new Date(),
      });
    }

    await problem.save();

    res.status(200).json({
      success: true,
      message: 'Nodal review recorded successfully',
      data: problem,
    });
  } catch (error) {
    console.error('Error during Nodal review:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getNodalProblems,
  getNodalStats,
  reviewProblem,
};
