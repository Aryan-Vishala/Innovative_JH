import express from 'express';
import { db } from '../data/store.js';

const router = express.Router();

router.get('/state-overview', (req, res) => {
  const totalProblems = db.problems.length + 1248; // Base state statistics + active
  const priVerified = db.problems.filter((p) => p.priValidated).length + 840;
  const activeProjects = db.projects.length + 342;
  const completedPilots = db.pilotDeployments.filter((p) => p.verifications.stage3_stateProgram.accepted).length + 78;

  // Beneficiary count from active pilots + historical
  const pilotBeneficiaries = db.pilotDeployments.reduce((acc, p) => acc + (p.beneficiaryCount || 0), 0);
  const totalBeneficiaries = 245000 + pilotBeneficiaries;

  // 24 Districts breakdown
  const districts = [
    { name: 'Gumla', problems: 48, activeProjects: 6, pilotsDeployed: 2, status: 'HIGH_PRIORITY_INTERVENTION' },
    { name: 'Ranchi', problems: 142, activeProjects: 24, pilotsDeployed: 12, status: 'INNOVATION_HUB' },
    { name: 'Dhanbad', problems: 98, activeProjects: 18, pilotsDeployed: 8, status: 'MINING_ENVIRONMENT_FOCUS' },
    { name: 'East Singhbhum', problems: 86, activeProjects: 15, pilotsDeployed: 7, status: 'TATA_CSR_PARTNER' },
    { name: 'Deoghar', problems: 64, activeProjects: 9, pilotsDeployed: 4, status: 'AIIMS_HEALTH_PILOT' },
    { name: 'Hazaribagh', problems: 52, activeProjects: 7, pilotsDeployed: 3, status: 'AGRI_CLUSTER' },
    { name: 'Bokaro', problems: 58, activeProjects: 8, pilotsDeployed: 4, status: 'ACTIVE' },
    { name: 'Palamu', problems: 72, activeProjects: 5, pilotsDeployed: 2, status: 'DROUGHT_ALERT' },
    { name: 'West Singhbhum', problems: 60, activeProjects: 6, pilotsDeployed: 2, status: 'FOREST_LIVELIHOODS' },
    { name: 'Giridih', problems: 54, activeProjects: 5, pilotsDeployed: 2, status: 'ACTIVE' },
    { name: 'Simdega', problems: 39, activeProjects: 4, pilotsDeployed: 1, status: 'GROUNDWATER_DEFICIT' },
    { name: 'Khunti', problems: 44, activeProjects: 6, pilotsDeployed: 3, status: 'LAC_SOLAR_CLUSTER' },
    { name: 'Dumka', problems: 46, activeProjects: 4, pilotsDeployed: 2, status: 'SANTHAL_PARGANA_LEAD' },
    { name: 'Godda', problems: 38, activeProjects: 3, pilotsDeployed: 1, status: 'ACTIVE' },
    { name: 'Garhwa', problems: 42, activeProjects: 3, pilotsDeployed: 1, status: 'ACTIVE' },
    { name: 'Chatra', problems: 36, activeProjects: 3, pilotsDeployed: 1, status: 'ACTIVE' },
    { name: 'Latehar', problems: 41, activeProjects: 4, pilotsDeployed: 2, status: 'FOREST_TECH' },
    { name: 'Lohardaga', problems: 33, activeProjects: 3, pilotsDeployed: 1, status: 'ACTIVE' },
    { name: 'Ramgarh', problems: 45, activeProjects: 5, pilotsDeployed: 2, status: 'MINING_RECLAMATION' },
    { name: 'Seraikela Kharsawan', problems: 49, activeProjects: 6, pilotsDeployed: 2, status: 'AUTO_MSME' },
    { name: 'Koderma', problems: 37, activeProjects: 3, pilotsDeployed: 1, status: 'ACTIVE' },
    { name: 'Jamtara', problems: 31, activeProjects: 2, pilotsDeployed: 1, status: 'ACTIVE' },
    { name: 'Sahibganj', problems: 35, activeProjects: 3, pilotsDeployed: 1, status: 'GANGA_BASIN' },
    { name: 'Pakur', problems: 29, activeProjects: 2, pilotsDeployed: 1, status: 'ACTIVE' }
  ];

  // Domain Distribution
  const domainDistribution = [
    { domain: 'Water Resources & Quality', count: 420, percentage: 33.6 },
    { domain: 'Smart Agriculture & Soil', count: 355, percentage: 28.4 },
    { domain: 'Rural Healthcare & Sanitation', count: 215, percentage: 17.2 },
    { domain: 'Urban Infrastructure & IoT', count: 140, percentage: 11.2 },
    { domain: 'Environment & Mining Reclamation', count: 120, percentage: 9.6 }
  ];

  // Quantified Social Impact
  const impactSummary = {
    totalBeneficiaries,
    litresSafeWaterDistributedM: 3.84, // Million Litres
    averageFluorideReductionPct: 80.9,
    solarBorewellUptimeHoursDaily: 8.5,
    stateInnovationGrantsDisbursedINR: 18500000, // 1.85 Cr
    activeUniversityPartners: db.organizations.filter((o) => ['nodal_hei', 'participating_hei'].includes(o.type)).length + 22,
    industryStartupsEngaged: db.organizations.filter((o) => o.type === 'industry_startup').length + 18
  };

  res.json({
    success: true,
    totalProblems,
    priVerified,
    activeProjects,
    completedPilots,
    impactSummary,
    domainDistribution,
    districts
  });
});

export default router;
