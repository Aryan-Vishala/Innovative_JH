import express from 'express';
import { db } from '../data/store.js';
import { authenticate } from '../middleware/auth.js';
import { validateStateTransition } from '../middleware/stateGuard.js';
import { analyzeProblemText } from '../services/aiClassifier.js';
import { recordAuditLog, getAuditLogsForEntity } from '../services/auditService.js';
import { sendNotification, broadcastToRole } from '../services/notificationService.js';
import { PROBLEM_STATES, SEVERITY_LEVELS, URGENCY_LEVELS } from '../config/constants.js';

const router = express.Router();

// List all problems
router.get('/', (req, res) => {
  const { district, domain, status } = req.query;
  let filtered = [...db.problems];

  if (district) filtered = filtered.filter((p) => p.district.toLowerCase() === district.toLowerCase());
  if (domain) filtered = filtered.filter((p) => p.thematicDomain === domain);
  if (status) filtered = filtered.filter((p) => p.status === status);

  res.json({ success: true, count: filtered.length, problems: filtered });
});

// Get single problem by ID with audit logs
router.get('/:id', (req, res) => {
  const problem = db.problems.find((p) => p.id === req.params.id);
  if (!problem) {
    return res.status(404).json({ success: false, message: 'Problem not found.' });
  }

  const auditLogs = getAuditLogsForEntity('problem', problem.id);
  res.json({ success: true, problem, auditLogs });
});

// Citizen submits a new problem
router.post('/', authenticate, (req, res) => {
  const {
    title,
    description,
    district = 'Gumla',
    block = 'Kamdara',
    panchayat = 'Kamdara Gram Panchayat',
    latitude = 22.8834,
    longitude = 84.9123,
    affectedPopulation = 1000,
    evidence = []
  } = req.body;

  if (!title || !description) {
    return res.status(400).json({ success: false, message: 'Title and description are required.' });
  }

  // 1. Run AI Classifier V1
  const aiResult = analyzeProblemText({ title, description, district });

  const problemId = `prob-${Date.now()}`;
  const problemCode = `JH-${aiResult.predictedDomain.substring(0, 3).toUpperCase()}-${Date.now().toString().slice(-4)}`;

  const newProblem = {
    id: problemId,
    code: problemCode,
    title,
    description,
    thematicDomain: aiResult.predictedDomain,
    subdomain: aiResult.predictedSubdomain,
    dualThemes: {
      quantity: {
        issue: 'Groundwater Table Depletion',
        baselineMetric: '3.0 Hours/Day potable water supply',
        targetMetric: '8.0 Hours/Day continuous solar-assisted supply'
      },
      quality: {
        issue: 'Toxic High Fluoride Concentration',
        baselineMetric: '4.2 PPM Fluoride',
        targetMetric: '< 1.0 PPM Permissible Standard'
      }
    },
    citizenUserId: req.user.id,
    citizenName: req.user.fullName,
    district,
    block,
    panchayat,
    latitude: Number(latitude),
    longitude: Number(longitude),
    severityLevel: aiResult.severityScore > 85 ? SEVERITY_LEVELS.CRITICAL : SEVERITY_LEVELS.HIGH,
    urgencyLevel: URGENCY_LEVELS.HIGH,
    affectedPopulation: Number(affectedPopulation),
    status: PROBLEM_STATES.PRI_VERIFICATION_PENDING,
    priValidated: false,
    priValidationRemarks: null,
    priValidatedAt: null,
    evidence,
    aiAnalysis: aiResult,
    createdAt: new Date().toISOString()
  };

  db.problems.unshift(newProblem);
  db.saveSnapshot();

  // 2. Record Audit Trail
  recordAuditLog({
    entityType: 'problem',
    entityId: newProblem.id,
    actorId: req.user.id,
    actorName: req.user.fullName,
    actorRole: req.user.role,
    action: 'CITIZEN_PROBLEM_SUBMITTED',
    newState: newProblem,
    justificationReason: `Submitted by citizen with AI classified domain '${aiResult.predictedDomain}'.`
  });

  // 3. Notify Local PRI Officers
  broadcastToRole('pri_officer', {
    title: `New Problem Reported in ${district}`,
    message: `Citizen ${req.user.fullName} logged a high-severity issue in ${block} Block. Awaiting ground verification.`,
    relatedProblemId: newProblem.id
  });

  res.status(201).json({
    success: true,
    message: 'Problem submitted and AI-analyzed successfully.',
    problem: newProblem
  });
});

// PRI Officer Ground Verification or Rejection
router.patch('/:id/pri-verify', authenticate, (req, res) => {
  const { decision, remarks, baselineData } = req.body; // decision: 'APPROVE' or 'REJECT'
  const problem = db.problems.find((p) => p.id === req.params.id);

  if (!problem) {
    return res.status(404).json({ success: false, message: 'Problem not found.' });
  }

  const targetState = decision === 'APPROVE' ? PROBLEM_STATES.PRI_VERIFIED : PROBLEM_STATES.REJECTED;

  // Validate state transition guard
  const transitionCheck = validateStateTransition(problem.status, targetState, req.user.role);
  if (!transitionCheck.allowed) {
    return res.status(transitionCheck.status).json({ success: false, message: transitionCheck.reason });
  }

  const oldState = { status: problem.status, priValidated: problem.priValidated };

  if (decision === 'APPROVE') {
    problem.status = PROBLEM_STATES.NODAL_ASSIGNED; // Transitions directly to Nodal Assigned
    problem.priValidated = true;
    problem.priValidationRemarks = remarks || 'Ground inspection verified. Community water shortage and fluoride symptoms confirmed.';
    problem.priValidatedAt = new Date().toISOString();
    problem.priVerifiedBy = {
      userId: req.user.id,
      officerName: req.user.fullName,
      designation: req.user.designation || 'Panchayat Secretary'
    };

    if (baselineData) {
      problem.groundBaseline = baselineData;
    }

    // Look up Nodal Institution
    const mapping = db.domainMappings.find((m) => m.domainKey === problem.thematicDomain && m.isActive);
    problem.assignedNodalOrgId = mapping ? mapping.nodalOrganizationId : 'org-bau';

    // Record Audit
    recordAuditLog({
      entityType: 'problem',
      entityId: problem.id,
      actorId: req.user.id,
      actorName: req.user.fullName,
      actorRole: req.user.role,
      action: 'PRI_GROUND_VERIFIED_AND_NODAL_ASSIGNED',
      oldState,
      newState: { status: problem.status, priValidated: true, remarks },
      justificationReason: remarks
    });

    // Notify Nodal Directors
    broadcastToRole('nodal_director', {
      title: `PRI-Verified Challenge Assigned to Nodal HEI`,
      message: `Problem #${problem.code} from ${problem.district} verified on-ground. Domain: ${problem.thematicDomain}.`,
      relatedProblemId: problem.id
    });
  } else {
    problem.status = PROBLEM_STATES.REJECTED;
    problem.priValidated = false;
    problem.priValidationRemarks = remarks || 'Ground verification failed. Insufficient evidence or duplicate report.';

    recordAuditLog({
      entityType: 'problem',
      entityId: problem.id,
      actorId: req.user.id,
      actorName: req.user.fullName,
      actorRole: req.user.role,
      action: 'PRI_PROBLEM_REJECTED',
      oldState,
      newState: { status: PROBLEM_STATES.REJECTED, remarks },
      justificationReason: remarks
    });
  }

  db.saveSnapshot();

  res.json({
    success: true,
    message: `Problem ground verification completed with outcome: ${decision}.`,
    problem
  });
});

// Formal Human AI Override (Domain or Nodal Institution reassignment)
router.patch('/:id/ai-override', authenticate, (req, res) => {
  const { newDomain, newNodalOrgId, overrideReason } = req.body;
  const problem = db.problems.find((p) => p.id === req.params.id);

  if (!problem) {
    return res.status(404).json({ success: false, message: 'Problem not found.' });
  }

  if (!overrideReason || overrideReason.trim().length < 10) {
    return res.status(400).json({
      success: false,
      message: 'Mandatory override justification reason (minimum 10 characters) is required for audit compliance.'
    });
  }

  const oldValues = {
    thematicDomain: problem.thematicDomain,
    assignedNodalOrgId: problem.assignedNodalOrgId,
    aiAnalysis: problem.aiAnalysis
  };

  if (newDomain) problem.thematicDomain = newDomain;
  if (newNodalOrgId) problem.assignedNodalOrgId = newNodalOrgId;

  problem.humanOverride = {
    overriddenByUserId: req.user.id,
    overriddenByName: req.user.fullName,
    role: req.user.role,
    reason: overrideReason,
    timestamp: new Date().toISOString()
  };

  recordAuditLog({
    entityType: 'problem',
    entityId: problem.id,
    actorId: req.user.id,
    actorName: req.user.fullName,
    actorRole: req.user.role,
    action: 'HUMAN_AI_RECOMMENDATION_OVERRIDDEN',
    oldState: oldValues,
    newState: {
      thematicDomain: problem.thematicDomain,
      assignedNodalOrgId: problem.assignedNodalOrgId
    },
    justificationReason: overrideReason
  });

  db.saveSnapshot();

  res.json({
    success: true,
    message: 'AI recommendation overridden and permanently recorded in audit trail.',
    problem
  });
});

export default router;
