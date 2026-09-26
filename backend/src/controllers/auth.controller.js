const bcrypt = require('bcryptjs');
const User = require('../models/User');
const Organization = require('../models/Organization');

// @desc    Register a new citizen or institution user
// @route   POST /api/v1/auth/register
// @access  Public
const register = async (req, res) => {
  try {
    const {
      name,
      email,
      mobile,
      password,
      primaryRole = 'citizen',
      district = '',
      block = '',
      panchayat = '',
      village = '',
      organizationName = '',
      organizationType = '',
    } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Name, email, and password are required',
      });
    }

    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'A user with this email address already exists',
      });
    }

    let organizationId = null;
    if (organizationName && organizationType) {
      let org = await Organization.findOne({
        name: new RegExp(`^${organizationName.trim()}$`, 'i'),
      });
      if (!org) {
        org = await Organization.create({
          name: organizationName.trim(),
          type: organizationType,
          district: district || 'Ranchi',
          block: block || '',
          code: organizationName.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 10),
        });
      }
      organizationId = org._id;
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    const user = await User.create({
      name,
      email: email.toLowerCase(),
      mobile,
      passwordHash,
      primaryRole,
      organizationId,
      organizationName,
      location: {
        district,
        block,
        panchayat,
        village,
      },
    });

    const token = user.generateAuthToken();

    res.status(201).json({
      success: true,
      message: 'Account created successfully',
      data: {
        user: user.toJSON(),
        token,
      },
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Server error during registration',
    });
  }
};

// @desc    Login user (Unified for Citizen, PRI, Nodal, HEI, Industry, Admin)
// @route   POST /api/v1/auth/login
// @access  Public
const login = async (req, res) => {
  try {
    const { email, password, role } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email and password are required',
      });
    }

    const query = {
      $or: [
        { email: email.toLowerCase().trim() },
        { mobile: email.trim() },
      ],
    };

    const user = await User.findOne(query).populate('organizationId');

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email/phone or password',
      });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email/phone or password',
      });
    }

    if (role && user.primaryRole !== role && user.primaryRole !== 'admin') {
      return res.status(403).json({
        success: false,
        message: `Account role mismatch: expected ${role}, user is ${user.primaryRole}`,
      });
    }

    const token = user.generateAuthToken();

    res.status(200).json({
      success: true,
      message: 'Logged in successfully',
      data: {
        user: user.toJSON(),
        token,
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Server error during login',
    });
  }
};

// @desc    Get current logged in user profile
// @route   GET /api/v1/auth/me
// @access  Private
const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate('organizationId');
    res.status(200).json({
      success: true,
      data: user.toJSON(),
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Logout user
// @route   POST /api/v1/auth/logout
// @access  Public
const logout = async (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Logged out successfully',
  });
};

module.exports = {
  register,
  login,
  getMe,
  logout,
};
