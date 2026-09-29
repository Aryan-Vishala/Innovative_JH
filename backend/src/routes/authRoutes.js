import express from 'express';
import bcrypt from 'bcryptjs';
import { db } from '../data/store.js';
import { signToken, authenticate } from '../middleware/auth.js';
import { recordAuditLog } from '../services/auditService.js';
import { USER_ROLES } from '../config/constants.js';

const router = express.Router();

// List all seeded users for quick role-switching in demonstration UI
router.get('/users', (req, res) => {
  const sanitized = db.users.map(({ passwordHash, ...rest }) => rest);
  res.json({ success: true, users: sanitized });
});

// List organizations
router.get('/organizations', (req, res) => {
  res.json({ success: true, organizations: db.organizations });
});

// Domain nodal mappings registry
router.get('/domain-mappings', (req, res) => {
  res.json({ success: true, domainMappings: db.domainMappings });
});

// Register a new user
router.post('/register', async (req, res) => {
  try {
    const {
      fullName,
      email,
      password,
      role = 'citizen',
      phone,
      district,
      organizationName,
      organizationId,
      designation
    } = req.body;

    if (!fullName || !email) {
      return res.status(400).json({
        success: false,
        message: 'Full Name and Email are required for registration.'
      });
    }

    const normalizedEmail = email.trim().toLowerCase();
    const existingUser = db.users.find(
      (u) => u.email && u.email.toLowerCase() === normalizedEmail
    );

    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: 'An account with this email address already exists.'
      });
    }

    // Role mapping
    const roleMap = {
      citizen: USER_ROLES.CITIZEN,
      university: USER_ROLES.FACULTY,
      industry: USER_ROLES.INDUSTRY_EXPERT,
      government: USER_ROLES.PRI_OFFICER,
      faculty: USER_ROLES.FACULTY,
      student: USER_ROLES.STUDENT,
      nodal_director: USER_ROLES.NODAL_DIRECTOR,
      pri_officer: USER_ROLES.PRI_OFFICER,
      industry_expert: USER_ROLES.INDUSTRY_EXPERT,
      state_admin: USER_ROLES.STATE_ADMIN
    };

    const finalRole = roleMap[role.toLowerCase()] || USER_ROLES.CITIZEN;

    // Avatar by role
    const avatarMap = {
      [USER_ROLES.CITIZEN]: '👨‍🌾',
      [USER_ROLES.FACULTY]: '👩‍🔬',
      [USER_ROLES.STUDENT]: '🎓',
      [USER_ROLES.INDUSTRY_EXPERT]: '👷‍♂️',
      [USER_ROLES.PRI_OFFICER]: '🏛️',
      [USER_ROLES.NODAL_DIRECTOR]: '🔬',
      [USER_ROLES.STATE_ADMIN]: '🏛️'
    };

    // Designation default
    const designationMap = {
      [USER_ROLES.CITIZEN]: 'Citizen Contributor',
      [USER_ROLES.FACULTY]: 'Faculty Researcher',
      [USER_ROLES.STUDENT]: 'Student Researcher',
      [USER_ROLES.INDUSTRY_EXPERT]: 'Industry Specialist',
      [USER_ROLES.PRI_OFFICER]: 'Panchayat Field Officer',
      [USER_ROLES.NODAL_DIRECTOR]: 'Nodal Director',
      [USER_ROLES.STATE_ADMIN]: 'State Program Administrator'
    };

    // Handle Organization association or auto-creation
    let assignedOrgId = organizationId || null;
    let finalOrgName = organizationName ? organizationName.trim() : null;

    if (!assignedOrgId && finalOrgName) {
      const match = db.organizations.find(
        (o) => o.name.toLowerCase() === finalOrgName.toLowerCase()
      );
      if (match) {
        assignedOrgId = match.id;
        finalOrgName = match.name;
      } else {
        assignedOrgId = `org-${Date.now().toString(36)}`;
        db.organizations.push({
          id: assignedOrgId,
          name: finalOrgName,
          type:
            finalRole === USER_ROLES.FACULTY
              ? 'participating_hei'
              : finalRole === USER_ROLES.INDUSTRY_EXPERT
              ? 'industry_startup'
              : 'citizen_community',
          district: district || 'Ranchi',
          verified: true,
          accreditationRating: 4.5
        });
      }
    }

    const passwordHash = password
      ? await bcrypt.hash(password, 10)
      : await bcrypt.hash('password123', 10);

    const newUser = {
      id: `usr-${finalRole.replace(/_/g, '-')}-${Date.now().toString(36)}`,
      email: normalizedEmail,
      passwordHash,
      fullName: fullName.trim(),
      phone: phone || null,
      role: finalRole,
      organizationId: assignedOrgId,
      organizationName:
        finalOrgName || (finalRole === USER_ROLES.CITIZEN ? 'Citizen Community' : 'Independent'),
      district: district || 'Ranchi',
      designation: designation || designationMap[finalRole] || 'Registered Member',
      avatar: avatarMap[finalRole] || '👤',
      createdAt: new Date().toISOString()
    };

    db.users.push(newUser);
    db.saveSnapshot();

    recordAuditLog({
      entityType: 'user',
      entityId: newUser.id,
      actorId: newUser.id,
      actorName: newUser.fullName,
      actorRole: newUser.role,
      action: 'USER_REGISTERED',
      justificationReason: `New registration for ${newUser.fullName} (${newUser.role})`
    });

    const token = signToken(newUser);
    const org = db.organizations.find((o) => o.id === newUser.organizationId);

    res.status(201).json({
      success: true,
      message: 'Account registered successfully.',
      token,
      user: {
        id: newUser.id,
        email: newUser.email,
        fullName: newUser.fullName,
        role: newUser.role,
        district: newUser.district,
        designation: newUser.designation,
        avatar: newUser.avatar,
        organizationId: newUser.organizationId,
        organizationName: newUser.organizationName,
        organizationType: org ? org.type : null
      }
    });
  } catch (err) {
    console.error('[Registration Error]:', err);
    res.status(500).json({
      success: false,
      message: 'Failed to register account: ' + err.message
    });
  }
});

// Login
router.post('/login', async (req, res) => {
  const { email, role, password } = req.body;
  let user = null;

  if (email) {
    user = db.users.find((u) => u.email && u.email.toLowerCase() === email.trim().toLowerCase());
  } else if (role) {
    user = db.users.find((u) => u.role === role);
  }

  if (!user) {
    return res.status(401).json({ success: false, message: 'Invalid credentials or user not found.' });
  }

  if (password && user.passwordHash) {
    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid password. Please check your credentials.' });
    }
  }

  const token = signToken(user);
  const org = db.organizations.find((o) => o.id === user.organizationId);

  res.json({
    success: true,
    token,
    user: {
      id: user.id,
      email: user.email,
      fullName: user.fullName,
      role: user.role,
      district: user.district,
      designation: user.designation,
      avatar: user.avatar,
      organizationId: user.organizationId,
      organizationName: user.organizationName,
      organizationType: org ? org.type : null
    }
  });
});

// Switch user context for easy vertical slice demonstration
router.post('/switch-user', (req, res) => {
  const { userId } = req.body;
  const user = db.users.find((u) => u.id === userId);

  if (!user) {
    return res.status(404).json({ success: false, message: 'User not found.' });
  }

  const token = signToken(user);
  const org = db.organizations.find((o) => o.id === user.organizationId);

  res.json({
    success: true,
    token,
    user: {
      id: user.id,
      email: user.email,
      fullName: user.fullName,
      role: user.role,
      district: user.district,
      designation: user.designation,
      avatar: user.avatar,
      organizationId: user.organizationId,
      organizationName: user.organizationName,
      organizationType: org ? org.type : null
    }
  });
});

// Current user profile
router.get('/me', authenticate, (req, res) => {
  res.json({ success: true, user: req.user });
});

// Reset entire database to initial seed state
router.post('/reset-demo', authenticate, (req, res) => {
  db.resetToSeed();
  recordAuditLog({
    entityType: 'system',
    entityId: 'database',
    actorId: req.user.id,
    actorName: req.user.fullName,
    actorRole: req.user.role,
    action: 'DEMO_RESET_TO_SEED',
    justificationReason: 'System reset to benchmark state for demonstration.'
  });
  res.json({ success: true, message: 'System reset to clean benchmark state successfully.' });
});

export default route