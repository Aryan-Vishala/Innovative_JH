const express = require('express');
const router = express.Router();
const {
  createProblem,
  getProblems,
  getPublicAnalytics,
  getMySubmissions,
  getProblemById,
  getAiTriage,
  upvoteProblem,
  adoptProblem,
  pledgeProblem,
  updateSubProblem,
} = require('../controllers/problem.controller');
const { validateProblem } = require('../controllers/pri.controller');
const { reviewProblem } = require('../controllers/nodal.controller');
const { protect } = require('../middleware/auth.middleware');
const { authorizeRoles } = require('../middleware/role.middleware');
const upload = require('../middleware/upload.middleware');

// Public endpoints
router.post('/ai-triage', getAiTriage);
router.get('/', getProblems);
router.get('/public-analytics', getPublicAnalytics);

// Citizen submissions & details
router.post('/', protect, upload.array('evidenceFiles', 5), createProblem);
router.get('/my-submissions', protect, getMySubmissions);
router.get('/:id', getProblemById);

// Quad-Helix Action Hub Endpoints
router.post('/:id/upvote', protect, upvoteProblem);
router.post('/:id/adopt', protect, authorizeRoles('participating_hei', 'nodal', 'admin', 'citizen', 'pri', 'industry'), adoptProblem);
router.post('/:id/pledge', protect, authorizeRoles('industry', 'admin', 'citizen', 'participating_hei', 'pri'), pledgeProblem);

// AI Modular Decomposition & Sub-Problem Reassignment Endpoint
router.patch('/:id/subproblems/:subProblemId', protect, updateSubProblem);

// Specialized state transition endpoints
router.patch('/:id/pri-validate', protect, authorizeRoles('pri', 'admin', 'citizen', 'participating_hei', 'industry'), validateProblem);
router.patch('/:id/nodal-review', protect, authorizeRoles('nodal', 'admin'), reviewProblem);

module.exports = router;
