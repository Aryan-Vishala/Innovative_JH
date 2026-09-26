const Problem = require('../models/Problem');

// @desc    Get PRI Verification Queue
// @route   GET /api/v1/pri/queue
// @access  Private (PRI, Admin)
const getPriQueue = async (req, res) => {
  try {
    const userDistrict = req.user.location?.district;
    const userBlock = req.user.location?.block;

    const filter = {
      status: { $in: ['SUBMITTED', 'PRI_VERIFICATION_PENDING'] },
    };

    // If PRI user has assigned district, prioritize/filter by district
    if (userDistrict && userDistrict !== 'All') {
      filter['location.district'] = new RegExp(userDistrict, 'i');
    }

    const queue = await Problem.find(filter)
      .sort({ createdAt: -1 })
      .populate('createdBy', 'name email mobile');

    res.status(200).json({
      success: true,
      count: queue.length,
      data: queue,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get PRI Dashboard Stats
// @route   GET /api/v1/pri/stats
// @access  Private (PRI, Admin)
const getPriStats = async (req, res) => {
  try {
    const userDistrict = req.user.location?.district;
    const filter = {};
    if (userDistrict && userDistrict !== 'All') {
      filter['location.district'] = new RegExp(userDistrict, 'i');
    }

    const pendingVerification = await Problem.countDocuments({
      ...filter,
      status: { $in: ['SUBMITTED', 'PRI_VERIFICATION_PENDING'] },
    });

    const highPriority = await Problem.countDocuments({
      ...filter,
      status: { $in: ['SUBMITTED', 'PRI_VERIFICATION_PENDING'] },
      'impact.citizenReportedSeverity': { $in: ['High', 'Critical'] },
    });

    const verified = await Problem.countDocuments({
      ...filter,
      status: 'PRI_VERIFIED',
    });

    const total = await Problem.countDocuments(filter);

    res.status(200).json({
      success: true,
      data: {
        pendingVerification,
        highPriority,
        verified,
        total,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Validate/Reject problem by PRI Ground Verification
// @route   PATCH /api/v1/problems/:id/pri-validate
// @access  Private (PRI, Admin)
const validateProblem = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      isGenuine,
      observedPopulation,
      groundCondition,
      baselineData = {},
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

    const isVerified = isGenuine === true || isGenuine === 'true';

    problem.priVerification = {
      verifiedBy: req.user._id,
      verifierName: req.user.name,
      verifiedAt: new Date(),
      isGenuine: isVerified,
      observedPopulation: observedPopulation ? parseInt(observedPopulation, 10) : problem.impact.estimatedPopulation,
      groundCondition: groundCondition || '',
      baselineData: typeof baselineData === 'string' ? JSON.parse(baselineData || '{}') : baselineData,
      remarks: remarks || '',
    };

    if (isVerified) {
      problem.status = 'PRI_VERIFIED';
      problem.assignedTo = 'Nodal HEI Orchestration Pending';
      problem.timeline.push({
        stage: 'PRI_VERIFIED',
        description: `Verified by PRI Officer ${req.user.name}. Ground inspection confirmed genuine.`,
        updatedBy: req.user._id,
        updaterName: req.user.name,
        timestamp: new Date(),
      });
    } else {
      problem.status = 'REJECTED';
      problem.assignedTo = 'Closed / Rejected by Local PRI';
      problem.timeline.push({
        stage: 'REJECTED',
        description: `Rejected by PRI Officer ${req.user.name}. Reason: ${remarks || 'Did not meet ground criteria.'}`,
        updatedBy: req.user._id,
        updaterName: req.user.name,
        timestamp: new Date(),
      });
    }

    await problem.save();

    res.status(200).json({
      success: true,
      message: isVerified ? 'Problem verified successfully by PRI' : 'Problem rejected by PRI',
      data: problem,
    });
  } catch (error) {
    console.error('Error validating problem:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getPriQueue,
  getPriStats,
  validateProblem,
};
