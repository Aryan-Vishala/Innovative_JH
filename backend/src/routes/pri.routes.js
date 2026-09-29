const express = require('express');
const router = express.Router();
const { getPriQueue, getPriStats } = require('../controllers/pri.controller');
const { protect } = require('../middleware/auth.middleware');
const { authorizeRoles } = require('../middleware/role.middleware');

router.get('/queue', protect, authorizeRoles('pri', 'admin', 'nodal', 'citizen', 'participating_hei', 'industry'), getPriQueue);
router.get('/stats', protect, authorizeRoles('pri', 'admin', 'nodal', 'citizen', 'participating_hei', 'industry'), getPriStats);

module.exports = router;
