const Organization = require('../models/Organization');

// @desc    Get all organizations (filtered by type/district)
// @route   GET /api/v1/organizations
// @access  Public
const getOrganizations = async (req, res) => {
  try {
    const { type, district } = req.query;
    const filter = {};
    if (type) filter.type = type;
    if (district) filter.district = new RegExp(district, 'i');

    const organizations = await Organization.find(filter).sort({ name: 1 });
    res.status(200).json({
      success: true,
      count: organizations.length,
      data: organizations,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get single organization
// @route   GET /api/v1/organizations/:id
// @access  Public
const getOrganizationById = async (req, res) => {
  try {
    const organization = await Organization.findById(req.params.id);
    if (!organization) {
      return res.status(404).json({ success: false, message: 'Organization not found' });
    }
    res.status(200).json({ success: true, data: organization });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create an organization
// @route   POST /api/v1/organizations
// @access  Private (Admin)
const createOrganization = async (req, res) => {
  try {
    const org = await Organization.create(req.body);
    res.status(201).json({ success: true, data: org });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

module.exports = {
  getOrganizations,
  getOrganizationById,
  createOrganization,
};
