const express = require('express');
const router = express.Router();
const {
  getOrganizations,
  getOrganizationById,
  createOrganization,
} = require('../controllers/organization.controller');
const { protect } = require('../middleware/auth.middleware');
const { authorizeRoles } = require('../middleware/role.middleware');

router.get('/', getOrganizations);
router.get('/:id', getOrganizationById);
router.post('/', protect, authorizeRoles('admin'), createOrganization);

module.exports = router;
