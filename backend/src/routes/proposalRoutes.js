import express from 'express';
import { db } from '../data/store.js';
import { authenticate } from '../middleware/auth.js';
import { recordAuditLog } from '../services/auditService.js';
import { PROBLEM_STATES } from '../config/constants.js';

const router = express.Router();

// List proposals for a sub-problem
router.get('/sub-problem/:subProblemId', authenticate, (req, res) => {
  const proposals = db.proposals.filter((p) => p.subProblemId === req.params.subProblemId);
  res.json({ success: true, count: proposals.length, proposals });
});

// Submit a proposal for a sub-problem
router.post('/', authenticate, (req, res) => {
  const {
    subProblemId,
    title,
    abstract,
    technicalApproach,
    budgetINR = 300000,
    timelineWeeks = 8,
    teamMembers = [],
    ipPledge = 'Joint Academic-Industry Co-development'
  } = req.body;

  const subProblem = db.subProblems.find((sp) => sp.id === subProblemId);
  if (!subProblem) {
    return res.status(404).json({ success: false, message: 'Sub-problem not found.' });
  }

  const proposalId = `prop-${Date.now()}`;
  const org = db.organizations.find((o) => o.id === req.user.organizationId) || { name: req.user.organizationName, type: 'participating_hei' };

  const newProposal = {
    id: proposalId,
    subProblemId,
    problemId: subProblem.problemId,
    title,
    abstract,
    technicalApproach,
    budgetINR: Number(budgetINR),
    timelineWeeks: Number(timelineWeeks),
    organizationId: req.user.organizationId,
    organizationName: org.name,
    organizationType: org.type,
    leadUserId: req.user.id,
    leadName: req.user.fullName,
    teamMembers: teamMembers.length > 0 ? teamMembers : [
      { name: req.user.fullName, role: 'Lead PI', credits: 0 },
      { name: 'Aryan Kumar', role: 'Student Hardware Lead', credits: 4 },
      { name: 'Kavita Kumari', role: 'Student Firmware Researcher', credits: 4 }
    ],
    ipPledge,
    status: 'SUBMITTED',
    compositeScore: null,
    evaluationCount: 0,
    createdAt: new Date().toISOString()
  };

  db.proposals.push(newProposal);

  // Update sub-problem and problem status
  subProblem.status = PROBLEM_STATES.PROPOSALS_RECEIVED;
  const problem = db.problems.find((p) => p.id === subProblem.problemId);
  if (problem) {
    problem.status = PROBLEM_STATES.PROPOSALS_RECEIVED;
  }

  recordAuditLog({
    entityType: 'proposal',
    entityId: newProposal.id,
    actorId: req.user.id,
    actorName: req.user.fullName,
    actorRole: req.user.role,
    action: 'PROPOSAL_SUBMITTED',
    newState: newProposal,
    justificationReason: `Submitted proposal for Sub-Problem '${subProblem.title}' by ${org.name}.`
  });

  db.saveSnapshot();

  res.status(201).json({
    success: true,
    message: 'Proposal submitted successfully for expert evaluation.',
    proposal: newProposal
  });
});

// Evaluation Committee Member scores a proposal across 7 parameters
router.post('/:id/score', authenticate, (req, res) => {
  const {
    technicalFeasibility = 18,   // max 20
    socialImpact = 19,           // max 20
    costEfficiency = 13,         // max 15
    scalability = 14,            // max 15
    implementationViability = 9, // max 10
    sustainability = 9,          // max 10
    innovationNovelty = 9,       // max 10
    evaluationRemarks = 'Excellent sensor sensitivity and low-cost solar design tailored for Gumla fluoride conditions.'
  } = req.body;

  const proposal = db.proposals.find((p) => p.id === req.params.id);
  if (!proposal) {
    return res.status(404).json({ success: false, message: 'Proposal not found.' });
  }

  const totalScore = Number(technicalFeasibility) +
    Number(socialImpact) +
    Number(costEfficiency) +
    Number(scalability) +
    Number(implementationViability) +
    Number(sustainability) +
    Number(innovationNovelty);

  const evaluationId = `eval-${Date.now()}`;
  const scoreEntry = {
    id: evaluationId,
    proposalId: proposal.id,
    evaluatorUserId: req.user.id,
    evaluatorName: req.user.fullName,
    evaluatorRole: req.user.role,
    scores: {
      technicalFeasibility: Number(technicalFeasibility),
      socialImpact: Number(socialImpact),
      costEfficiency: Number(costEfficiency),
      scalability: Number(scalability),
      implementationViability: Number(implementationViability),
      sustainability: Number(sustainability),
      innovationNovelty: Number(innovationNovelty)
    },
    totalScore,
    evaluationRemarks,
    createdAt: new Date().toISOString()
  };

  db.evaluationScores.push(scoreEntry);

  // Update proposal composite score average
  const allScoresForProp = db.evaluationScores.filter((e) => e.proposalId === proposal.id);
  const avgScore = allScoresForProp.reduce((acc, s) => acc + s.totalScore, 0) / allScoresForProp.length;

  proposal.compositeScore = Math.round(avgScore * 10) / 10;
  proposal.evaluationCount = allScoresForProp.length;
  proposal.status = 'EVALUATED';

  // Update problem status to EVALUATION_RECOMMENDED
  const problem = db.problems.find((p) => p.id === proposal.problemId);
  if (problem) {
    problem.status = PROBLEM_STATES.EVALUATION_RECOMMENDED;
  }

  recordAuditLog({
    entityType: 'proposal',
    entityId: proposal.id,
    actorId: req.user.id,
    actorName: req.user.fullName,
    actorRole: req.user.role,
    action: 'PROPOSAL_EVALUATION_SCORED',
    newState: { compositeScore: proposal.compositeScore, latestScore: scoreEntry },
    justificationReason: `Evaluation committee scored proposal: ${totalScore}/100. Remarks: ${evaluationRemarks}`
  });

  db.saveSnapshot();

  res.json({
    success: true,
    message: `Proposal scored successfully (${totalScore}/100). Composite score updated.`,
    scoreEntry,
    proposal
  });
});

export default router;
