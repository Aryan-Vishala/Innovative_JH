import express from 'express';
import { db } from '../data/store.js';
import { authenticate } from '../middleware/auth.js';
import { recordAuditLog } from '../services/auditService.js';
import { PROBLEM_STATES, METRIC_DIRECTIONS } from '../config/constants.js';

const router = express.Router();

// List all pilot deployments
router.get('/', (req, res) => {
  res.json({ success: true, count: db.pilotDeployments.length, pilots: db.pilotDeployments });
});

// Get pilot detail by ID
router.get('/:id', (req, res) => {
  const pilot = db.pilotDeployments.find((p) => p.id === req.params.id);
  if (!pilot) {
    return res.status(404).json({ success: false, message: 'Pilot deployment not found.' });
  }
  const auditLogs = db.auditLogs.filter((l) => l.entityType === 'pilot' && l.entityId === pilot.id);
  res.json({ success: true, pilot, auditLogs });
});

// Deploy field pilot in target Panchayat
router.post('/deploy', authenticate, (req, res) => {
  const {
    projectId,
    district = 'Gumla',
    block = 'Kamdara',
    panchayat = 'Kamdara Gram Panchayat',
    beneficiaryCount = 2400
  } = req.body;

  const project = db.projects.find((p) => p.id === projectId);
  if (!project) {
    return res.status(404).json({ success: false, message: 'Project not found.' });
  }

  const pilotId = `pilot-${Date.now()}`;
  const newPilot = {
    id: pilotId,
    projectId: project.id,
    projectTitle: project.title,
    problemId: project.problemId,
    district,
    block,
    panchayat,
    deploymentDate: new Date().toISOString(),
    beneficiaryCount: Number(beneficiaryCount),
    status: PROBLEM_STATES.FIELD_PILOT_DEPLOYED,
    hardwareUnits: [
      { unitId: 'GUM-FL-01', model: 'Solar LoRaWAN Fluoride Monitor & Auto-Relay', location: 'Kamdara Community Well #2' },
      { unitId: 'GUM-FL-02', model: 'Adsorption Filter & Telemetry Rig', location: 'Kamdara Govt Middle School' }
    ],
    // Directional Metrics Engine (Direction: INCREASE or DECREASE)
    metrics: [
      {
        id: 'metric-fluoride',
        name: 'Fluoride Chemical Concentration',
        direction: METRIC_DIRECTIONS.DECREASE, // DECREASE is SUCCESS
        baselineValue: 4.2,
        postSolutionValue: 0.8,
        unit: 'PPM',
        safeStandardThreshold: 1.0,
        // (4.2 - 0.8) / 4.2 * 100 = 80.95% reduction
        improvementPercentage: 80.95,
        status: 'SUCCESS_MET'
      },
      {
        id: 'metric-water-access',
        name: 'Daily Potable Water Access Hours',
        direction: METRIC_DIRECTIONS.INCREASE, // INCREASE is SUCCESS
        baselineValue: 3.0,
        postSolutionValue: 8.5,
        unit: 'Hours/Day',
        safeStandardThreshold: 6.0,
        // (8.5 - 3.0) / 3.0 * 100 = 183.33% increase
        improvementPercentage: 183.33,
        status: 'SUCCESS_MET'
      },
      {
        id: 'metric-monthly-savings',
        name: 'Community Medical Expenditure on Waterborne Ailments',
        direction: METRIC_DIRECTIONS.DECREASE,
        baselineValue: 45000,
        postSolutionValue: 8000,
        unit: 'INR/Month',
        improvementPercentage: 82.22,
        status: 'SUCCESS_MET'
      }
    ],
    // 3-Stage Impact Verification Pipeline
    verifications: {
      stage1_priGround: {
        verified: false,
        officerName: null,
        designation: null,
        verifiedAt: null,
        remarks: null
      },
      stage2_nodalTechnical: {
        verified: false,
        directorName: null,
        labAssayReportUrl: null,
        verifiedAt: null,
        remarks: null
      },
      stage3_stateProgram: {
        accepted: false,
        adminName: null,
        scaleUpGrantSanctionedINR: null,
        acceptedAt: null,
        remarks: null
      }
    },
    createdAt: new Date().toISOString()
  };

  db.pilotDeployments.unshift(newPilot);

  project.status = PROBLEM_STATES.FIELD_PILOT_DEPLOYED;
  const problem = db.problems.find((p) => p.id === project.problemId);
  if (problem) {
    problem.status = PROBLEM_STATES.FIELD_PILOT_DEPLOYED;
  }

  recordAuditLog({
    entityType: 'pilot',
    entityId: newPilot.id,
    actorId: req.user.id,
    actorName: req.user.fullName,
    actorRole: req.user.role,
    action: 'FIELD_PILOT_DEPLOYED',
    newState: newPilot,
    justificationReason: `Pilot hardware commissioned in ${panchayat}, ${district} for ${beneficiaryCount} villagers.`
  });

  db.saveSnapshot();

  res.status(201).json({
    success: true,
    message: 'Field pilot deployed. Ready for 3-stage impact verification.',
    pilot: newPilot
  });
});

// Stage 1: PRI Officer Ground Verification
router.patch('/:id/pri-ground-verify', authenticate, (req, res) => {
  const { remarks } = req.body;
  const pilot = db.pilotDeployments.find((p) => p.id === req.params.id);

  if (!pilot) {
    return res.status(404).json({ success: false, message: 'Pilot not found.' });
  }

  pilot.verifications.stage1_priGround = {
    verified: true,
    officerName: req.user.fullName,
    designation: req.user.designation || 'Panchayat Secretary',
    verifiedAt: new Date().toISOString(),
    remarks: remarks || 'Physically inspected installation in Kamdara. Unit is operational, 2,400+ villagers have clean continuous drinking water.'
  };

  pilot.status = PROBLEM_STATES.PRI_GROUND_VERIFIED;
  const problem = db.problems.find((p) => p.id === pilot.problemId);
  if (problem) problem.status = PROBLEM_STATES.PRI_GROUND_VERIFIED;

  recordAuditLog({
    entityType: 'pilot',
    entityId: pilot.id,
    actorId: req.user.id,
    actorName: req.user.fullName,
    actorRole: req.user.role,
    action: 'PRI_GROUND_VERIFICATION_SIGNED_OFF',
    newState: pilot.verifications.stage1_priGround,
    justificationReason: remarks || 'Gram Panchayat confirmed physical installation and community access.'
  });

  db.saveSnapshot();

  res.json({
    success: true,
    message: 'Stage 1: PRI Ground Verification signed off successfully.',
    pilot
  });
});

// Stage 2: Nodal Director Technical & Lab Water Assay Verification
router.patch('/:id/nodal-technical-verify', authenticate, (req, res) => {
  const { remarks, labAssayReportUrl } = req.body;
  const pilot = db.pilotDeployments.find((p) => p.id === req.params.id);

  if (!pilot) {
    return res.status(404).json({ success: false, message: 'Pilot not found.' });
  }

  if (!pilot.verifications.stage1_priGround.verified) {
    return res.status(422).json({
      success: false,
      message: 'Cannot perform Technical Verification before Stage 1 PRI Ground Verification is completed.'
    });
  }

  pilot.verifications.stage2_nodalTechnical = {
    verified: true,
    directorName: req.user.fullName,
    labAssayReportUrl: labAssayReportUrl || 'https://example.com/bau_certified_water_assay_report.pdf',
    verifiedAt: new Date().toISOString(),
    remarks: remarks || 'Certified by BAU & IIT ISM hydrology lab: Fluoride reduced from 4.2 PPM to 0.8 PPM (within WHO 1.0 standard). Telemetry continuous 24/7 uptime confirmed.'
  };

  pilot.status = PROBLEM_STATES.TECHNICAL_VERIFIED;
  const problem = db.problems.find((p) => p.id === pilot.problemId);
  if (problem) problem.status = PROBLEM_STATES.TECHNICAL_VERIFIED;

  recordAuditLog({
    entityType: 'pilot',
    entityId: pilot.id,
    actorId: req.user.id,
    actorName: req.user.fullName,
    actorRole: req.user.role,
    action: 'NODAL_TECHNICAL_VERIFICATION_SIGNED_OFF',
    newState: pilot.verifications.stage2_nodalTechnical,
    justificationReason: remarks || 'Technical laboratory water assay and telemetry audit validated.'
  });

  db.saveSnapshot();

  res.json({
    success: true,
    message: 'Stage 2: Nodal Technical Verification signed off successfully.',
    pilot
  });
});

// Stage 3: State Government Program Acceptance & Scale-up Sanction
router.patch('/:id/state-program-accept', authenticate, (req, res) => {
  const { scaleUpGrantSanctionedINR = 2500000, remarks } = req.body;
  const pilot = db.pilotDeployments.find((p) => p.id === req.params.id);

  if (!pilot) {
    return res.status(404).json({ success: false, message: 'Pilot not found.' });
  }

  if (!pilot.verifications.stage2_nodalTechnical.verified) {
    return res.status(422).json({
      success: false,
      message: 'Cannot perform State Program Acceptance before Stage 2 Nodal Technical Verification is completed.'
    });
  }

  pilot.verifications.stage3_stateProgram = {
    accepted: true,
    adminName: req.user.fullName,
    scaleUpGrantSanctionedINR: Number(scaleUpGrantSanctionedINR),
    acceptedAt: new Date().toISOString(),
    remarks: remarks || 'Govt of Jharkhand DHTE officially accepts pilot outcomes. Sanctioning ₹25 Lakhs for multi-district rollout across Gumla, Simdega, and Palamu.'
  };

  pilot.status = PROBLEM_STATES.STATE_ACCEPTED;
  const problem = db.problems.find((p) => p.id === pilot.problemId);
  if (problem) problem.status = PROBLEM_STATES.STATE_ACCEPTED;

  recordAuditLog({
    entityType: 'pilot',
    entityId: pilot.id,
    actorId: req.user.id,
    actorName: req.user.fullName,
    actorRole: req.user.role,
    action: 'STATE_PROGRAM_ACCEPTANCE_SANCTIONED',
    newState: pilot.verifications.stage3_stateProgram,
    justificationReason: remarks || 'State Administration accepted outcomes and sanctioned scale-up grant.'
  });

  db.saveSnapshot();

  res.json({
    success: true,
    message: 'Stage 3: State Program Acceptance granted. Innovation entered in State Repository.',
    pilot
  });
});

export default router;
