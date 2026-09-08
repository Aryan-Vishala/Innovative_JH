import express from 'express';
import { db } from '../data/store.js';
import { authenticate } from '../middleware/auth.js';
import { recordAuditLog } from '../services/auditService.js';
import { PROBLEM_STATES } from '../config/constants.js';

const router = express.Router();

// List all projects
router.get('/', (req, res) => {
  res.json({ success: true, count: db.projects.length, projects: db.projects });
});

// Get project detail by ID
router.get('/:id', (req, res) => {
  const project = db.projects.find((p) => p.id === req.params.id);
  if (!project) {
    return res.status(404).json({ success: false, message: 'Project not found.' });
  }

  const problem = db.problems.find((p) => p.id === project.problemId);
  const auditLogs = db.auditLogs.filter((l) => l.entityType === 'project' && l.entityId === project.id);

  res.json({ success: true, project, problem, auditLogs });
});

// Submit milestone deliverable proof
router.patch('/:id/milestones/:mId/submit', authenticate, (req, res) => {
  const { proofDocumentUrl, remarks } = req.body;
  const project = db.projects.find((p) => p.id === req.params.id);

  if (!project) {
    return res.status(404).json({ success: false, message: 'Project not found.' });
  }

  const milestone = project.milestones.find((m) => m.id === req.params.mId);
  if (!milestone) {
    return res.status(404).json({ success: false, message: 'Milestone not found.' });
  }

  milestone.status = 'SUBMITTED_FOR_REVIEW';
  milestone.proofDocument = proofDocumentUrl || 'https://example.com/field_unit_lab_validation_proof.pdf';
  milestone.submittedBy = req.user.fullName;
  milestone.submittedAt = new Date().toISOString();
  milestone.submissionRemarks = remarks || 'Completed prototype calibration and lab testing.';

  recordAuditLog({
    entityType: 'project',
    entityId: project.id,
    actorId: req.user.id,
    actorName: req.user.fullName,
    actorRole: req.user.role,
    action: 'MILESTONE_DELIVERABLE_SUBMITTED',
    newState: { milestoneId: milestone.id, status: milestone.status, proof: milestone.proofDocument },
    justificationReason: `Submitted proof document for Milestone '${milestone.title}'.`
  });

  db.saveSnapshot();

  res.json({ success: true, message: 'Milestone proof submitted for Nodal Director review.', milestone, project });
});

// Nodal Director verifies and approves milestone
router.patch('/:id/milestones/:mId/verify', authenticate, (req, res) => {
  const { remarks } = req.body;
  const project = db.projects.find((p) => p.id === req.params.id);

  if (!project) {
    return res.status(404).json({ success: false, message: 'Project not found.' });
  }

  const milestone = project.milestones.find((m) => m.id === req.params.mId);
  if (!milestone) {
    return res.status(404).json({ success: false, message: 'Milestone not found.' });
  }

  milestone.status = 'VERIFIED_APPROVED';
  milestone.verifiedBy = req.user.fullName;
  milestone.verifiedAt = new Date().toISOString();
  milestone.verificationRemarks = remarks || 'Technical verification passed. Ready for field pilot deployment.';

  // Check if all milestones are approved
  const allApproved = project.milestones.every((m) => m.status === 'VERIFIED_APPROVED');
  if (allApproved) {
    project.status = PROBLEM_STATES.LAB_VALIDATED;
    project.solutionVersion = 'v1.0_PILOT_READY';

    const problem = db.problems.find((p) => p.id === project.problemId);
    if (problem) {
      problem.status = PROBLEM_STATES.LAB_VALIDATED;
    }
  }

  recordAuditLog({
    entityType: 'project',
    entityId: project.id,
    actorId: req.user.id,
    actorName: req.user.fullName,
    actorRole: req.user.role,
    action: 'MILESTONE_VERIFIED_APPROVED',
    newState: { milestoneId: milestone.id, allApproved, projectStatus: project.status },
    justificationReason: remarks || 'Nodal Director verified laboratory outcomes.'
  });

  db.saveSnapshot();

  res.json({ success: true, message: 'Milestone verified and approved.', milestone, project });
});

export default router;
