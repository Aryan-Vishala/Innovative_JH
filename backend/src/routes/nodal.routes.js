const express = require('express');
const router = express.Router();
const { getNodalProblems, getNodalStats } = require('../controllers/nodal.controller');
const { protect } = require('../middleware/auth.middleware');
const { authorizeRoles } = require('../middleware/role.middleware');

router.get('/problems', protect, authorizeRoles('nodal', 'admin'), getNodalProblems);
router.get('/stats', protect, authorizeRoles('nodal', 'admin'), getNodalStats);

module.exports = router;
