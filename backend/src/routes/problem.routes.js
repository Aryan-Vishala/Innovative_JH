const express = require('express');
const router = express.Router();
const {
  createProblem,
  getProblems,
  getMySubmissions,
  getProblemById,
} = require('../controllers/problem.controller');
const { validateProblem } = require('../controllers/pri.controller');
const { reviewProblem } = require('../controllers/nodal.controller');
const { protect } = require('../middleware/auth.middleware');
const { authorizeRoles } = require('../middleware/role.middleware');
const upload = require('../middleware/upload.middleware');

router.post('/', protect, upload.array('evidenceFiles', 5), createProblem);
router.get('/', getProblems);
router.get('/my-submissions', protect, getMySubmissions);
router.get('/:id', getProblemById);

// Specialized state transition endpoints
router.patch('/:id/pri-validate', protect, authorizeRoles('pri', 'admin'), validateProblem);
router.patch('/:id/nodal-review', protect, authorizeRoles('nodal', 'admin'), reviewProblem);

module.exports = router;
