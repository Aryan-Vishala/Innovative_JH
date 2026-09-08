import express from 'express';
import { db } from '../data/store.js';
import { signToken, authenticate } from '../middleware/auth.js';
import { recordAuditLog } from '../services/auditService.js';

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

// Login
router.post('/login', (req, res) => {
  const { email, role } = req.body;
  const user = db.users.find((u) => u.email === email || (role && u.role === role));

  if (!user) {
    return res.status(401).json({ success: false, message: 'Invalid credentials or role.' });
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

export default router;
