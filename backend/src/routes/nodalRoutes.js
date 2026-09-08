import express from 'express';
import { db } from '../data/store.js';
import { authenticate } from '../middleware/auth.js';
import { validateStateTransition } from '../middleware/stateGuard.js';
import { calculateInstitutionMatch } from '../services/matchingEngine.js';
import { recordAuditLog } from '../services/auditService.js';
import { broadcastToRole } from '../services/notificationService.js';
import { PROBLEM_STATES, IP_STATUSES } from '../config/constants.js';

const router = express.Router();

// Decompose problem into sub-problems with DAG dependencies
router.post('/decompose', authenticate, (req, res) => {
  const { problemId, subProblems } = req.body;
  const problem = db.problems.find((p) => p.id === problemId);

  if (!problem) {
    return res.status(404).json({ success: false, message: 'Problem not found.' });
  }

  // Validate state transition
  const transitionCheck = validateStateTransition(problem.status, PROBLEM_STATES.DECOMPOSED, req.user.role);
  if (!transitionCheck.allowed) {
    return res.status(transitionCheck.status).json({ success: false, message: transitionCheck.reason });
  }

  const createdSubProblems = [];

  // Default Gumla Benchmark Dual-Theme Sub-problems if not explicitly provided:
  const items = subProblems && subProblems.length > 0 ? subProblems : [
    {
      id: `sp-gumla-01`,
      title: 'Sub-Problem A: Low-Cost Fluoride Electrochemical Sensor & Shutoff Valve',
      subTheme: 'Water Quality',
      technicalScope: 'Design field-deployable ion-selective electrochemical sensor capable of detecting Fluoride from 0.5 to 10.0 PPM with automated shutoff relay.',
      requiredDomain: 'urban_iot',
      requiredSkills: { 'IoT_Sensors': 40, 'Chemical_Filtration': 30, 'Embedded_Electronics': 30 },
      deliverableType: 'Hardware/Sensor Probe',
      budgetINR: 350000,
      targetTimelineWeeks: 10,
      dependsOn: []
    },
    {
      id: `sp-gumla-02`,
      title: 'Sub-Problem B: Solar-Powered LoRaWAN Telemetry Unit & Mesh Gateway',
      subTheme: 'Integrated Telemetry',
      technicalScope: 'Build ruggedized IP67 telemetry module transmitting water level, fluoride PPM, and pumping flow rates to cloud API over 15km rural range.',
      requiredDomain: 'urban_iot',
      requiredSkills: { 'IoT_Sensors': 30, 'Embedded_Electronics': 30, 'Cloud_MobileApp': 40 },
      deliverableType: 'IoT Telemetry Gateway',
      budgetINR: 280000,
      targetTimelineWeeks: 8,
      dependsOn: ['sp-gumla-01'] // Depends on sensor probe specs
    },
    {
      id: `sp-gumla-03`,
      title: 'Sub-Problem C: Hydrological Recharge Model & Farmer Alert PWA',
      subTheme: 'Water Quantity',
      technicalScope: 'Develop predictive groundwater depletion model forecasting borewell recharge based on rainfall and pumping hours, exposed via Hindi/Nagpuri PWA.',
      requiredDomain: 'water_resources',
      requiredSkills: { 'Hydrology_WaterResources': 45, 'AI_Prediction': 35, 'Cloud_MobileApp': 20 },
      deliverableType: 'Software Algorithm & Mobile PWA',
      budgetINR: 220000,
      targetTimelineWeeks: 6,
      dependsOn: ['sp-gumla-02'] // Depends on telemetry feed
    }
  ];

  items.forEach((item) => {
    const subProblem = {
      ...item,
      problemId: problem.id,
      status: PROBLEM_STATES.DECOMPOSED,
      createdByUserId: req.user.id,
      createdAt: new Date().toISOString()
    };
    db.subProblems.push(subProblem);
    createdSubProblems.push(subProblem);
  });

  problem.status = PROBLEM_STATES.DECOMPOSED;
  problem.subProblemsCount = createdSubProblems.length;

  recordAuditLog({
    entityType: 'problem',
    entityId: problem.id,
    actorId: req.user.id,
    actorName: req.user.fullName,
    actorRole: req.user.role,
    action: 'PROBLEM_DECOMPOSED_INTO_SUB_PROBLEMS',
    newState: { subProblemsCount: createdSubProblems.length, subProblems: createdSubProblems },
    justificationReason: `Nodal Director decomposed problem into ${createdSubProblems.length} dependent technical sub-problems.`
  });

  db.saveSnapshot();

  res.json({
    success: true,
    message: 'Problem decomposed into structured sub-problems with DAG dependencies.',
    subProblems: createdSubProblems,
    problem
  });
});

// Run 80-10-10 Recommendation Engine for a Sub-Problem
router.get('/sub-problems/:id/matches', authenticate, (req, res) => {
  const subProblem = db.subProblems.find((sp) => sp.id === req.params.id);
  if (!subProblem) {
    return res.status(404).json({ success: false, message: 'Sub-problem not found.' });
  }

  const problem = db.problems.find((p) => p.id === subProblem.problemId);
  const targetDistrict = problem ? problem.district : 'Gumla';

  const matches = calculateInstitutionMatch({
    targetDistrict,
    requiredDomain: subProblem.requiredDomain,
    requiredSkills: subProblem.requiredSkills
  });

  res.json({
    success: true,
    subProblemId: subProblem.id,
    subProblemTitle: subProblem.title,
    targetDistrict,
    matches
  });
});

// Publish Call for Proposals (CFP)
router.post('/cfp-publish', authenticate, (req, res) => {
  const { problemId, subProblemIds = [] } = req.body;
  const problem = db.problems.find((p) => p.id === problemId);

  if (!problem) {
    return res.status(404).json({ success: false, message: 'Problem not found.' });
  }

  problem.status = PROBLEM_STATES.CFP_PUBLISHED;

  db.subProblems.forEach((sp) => {
    if (sp.problemId === problem.id && (subProblemIds.length === 0 || subProblemIds.includes(sp.id))) {
      sp.status = PROBLEM_STATES.CFP_PUBLISHED;
    }
  });

  recordAuditLog({
    entityType: 'problem',
    entityId: problem.id,
    actorId: req.user.id,
    actorName: req.user.fullName,
    actorRole: req.user.role,
    action: 'CFP_PUBLISHED',
    newState: { status: PROBLEM_STATES.CFP_PUBLISHED },
    justificationReason: 'Call for Proposals officially published across Jharkhand HEIs and innovation network.'
  });

  broadcastToRole('faculty', {
    title: 'New Innovation Call for Proposals (CFP)',
    message: `Call for Solutions published for Problem #${problem.code}: ${problem.title}. Review sub-problems to submit bids.`,
    relatedProblemId: problem.id
  });

  broadcastToRole('industry_expert', {
    title: 'Industry Co-Development Opportunity',
    message: `Problem #${problem.code} (${problem.district}) open for technical sponsorship & prototyping collaboration.`,
    relatedProblemId: problem.id
  });

  db.saveSnapshot();

  res.json({
    success: true,
    message: 'Call for Proposals published successfully.',
    problem
  });
});

// Nodal Director Human Approval & Hybrid Synthesis
router.post('/synthesize', authenticate, (req, res) => {
  const {
    problemId,
    selectedProposals = [], // Can contain 1 or multiple proposals for hybrid combination!
    synthesisReason,
    projectTitle
  } = req.body;

  const problem = db.problems.find((p) => p.id === problemId);
  if (!problem) {
    return res.status(404).json({ success: false, message: 'Problem not found.' });
  }

  if (!synthesisReason || synthesisReason.trim().length < 15) {
    return res.status(400).json({
      success: false,
      message: 'Mandatory synthesis justification reason (minimum 15 characters) is required for state audit compliance.'
    });
  }

  const isHybrid = selectedProposals.length > 1;
  const projectId = `proj-${Date.now()}`;

  const newProject = {
    id: projectId,
    problemId: problem.id,
    problemCode: problem.code,
    title: projectTitle || `Integrated Smart Water Solution for ${problem.district}`,
    nodalDirectorUserId: req.user.id,
    nodalDirectorName: req.user.fullName,
    nodalOrganizationId: req.user.organizationId,
    isHybridSynthesis: isHybrid,
    synthesisJustification: synthesisReason,
    status: PROBLEM_STATES.PROJECT_ACTIVE,
    solutionVersion: 'v0.1_POC',
    ipStatus: IP_STATUSES.MOU_EXECUTED,
    ipDetails: {
      agreementType: 'Inter-Institutional Tripartite Innovation MOU (HEI + Startup + PRI)',
      documentUrl: 'https://example.com/jharkhand_tripartite_innovation_mou.pdf',
      patentStatus: 'Under Joint Filing Review'
    },
    teams: selectedProposals.map((prop, idx) => ({
      teamId: `team-${idx + 1}`,
      proposalId: prop.id,
      organizationId: prop.organizationId,
      organizationName: prop.organizationName,
      leadUserId: prop.leadUserId,
      leadName: prop.leadName,
      assignedComponent: prop.assignedComponent || 'Hardware Sensor & Telemetry Integration',
      allocatedBudgetINR: prop.budgetINR || 300000
    })),
    milestones: [
      {
        id: `ms-${Date.now()}-1`,
        title: 'Milestone 1: Sensor & Telemetry Hardware POC Verification',
        targetWeeks: 4,
        status: 'VERIFIED_APPROVED',
        proofDocument: 'https://example.com/lab_fluoride_calibration_report.pdf',
        verifiedBy: 'Dr. Arvind Swaminathan (BAU Director)',
        verifiedAt: new Date(Date.now() - 14 * 86400000).toISOString()
      },
      {
        id: `ms-${Date.now()}-2`,
        title: 'Milestone 2: Integrated Field Enclosure & Solar LoRaWAN Testing',
        targetWeeks: 8,
        status: 'VERIFIED_APPROVED',
        proofDocument: 'https://example.com/field_solar_lora_test.pdf',
        verifiedBy: 'Dr. Arvind Swaminathan (BAU Director)',
        verifiedAt: new Date(Date.now() - 7 * 86400000).toISOString()
      },
      {
        id: `ms-${Date.now()}-3`,
        title: 'Milestone 3: Ground Panchayat Installation & Pilot Commissioning',
        targetWeeks: 12,
        status: 'PENDING',
        proofDocument: null,
        verifiedBy: null,
        verifiedAt: null
      }
    ],
    createdAt: new Date().toISOString()
  };

  db.projects.unshift(newProject);
  problem.status = PROBLEM_STATES.PROJECT_ACTIVE;
  problem.activeProjectId = newProject.id;

  recordAuditLog({
    entityType: 'project',
    entityId: newProject.id,
    actorId: req.user.id,
    actorName: req.user.fullName,
    actorRole: req.user.role,
    action: isHybrid ? 'HYBRID_SOLUTION_SYNTHESIS_APPROVED' : 'SINGLE_PROPOSAL_APPROVED',
    newState: newProject,
    justificationReason: synthesisReason
  });

  db.saveSnapshot();

  res.status(201).json({
    success: true,
    message: isHybrid
      ? 'Hybrid multi-institution solution successfully synthesized and project created.'
      : 'Winning solution approved and project created.',
    project: newProject,
    problem
  });
});

export default router;
