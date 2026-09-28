require('dotenv').config({ path: require('path').join(__dirname, '../../.env') });
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const User = require('../models/User');
const Organization = require('../models/Organization');
const Problem = require('../models/Problem');

const seedData = async () => {
  try {
    console.log('[Seed] Connecting to MongoDB Atlas...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('[Seed] Connected to Atlas.');

    // Clear existing collections
    console.log('[Seed] Clearing existing demo collections...');
    await Promise.all([
      User.deleteMany({}),
      Organization.deleteMany({}),
      Problem.deleteMany({}),
    ]);

    // 1. Create Organizations
    console.log('[Seed] Creating demo organizations...');
    const orgs = await Organization.insertMany([
      {
        name: 'Birsa Agricultural University (BAU)',
        type: 'nodal_hei',
        code: 'BAU-RANCHI',
        district: 'Ranchi',
        domains: ['Agriculture', 'Water Management', 'Environment'],
        verified: true,
      },
      {
        name: 'Kamdara Gram Panchayat',
        type: 'pri_panchayat',
        code: 'KAMDARA-GP',
        district: 'Gumla',
        block: 'Kamdara',
        verified: true,
      },
      {
        name: 'Ranchi Municipal Corporation',
        type: 'ulb_municipality',
        code: 'RMC-RANCHI',
        district: 'Ranchi',
        verified: true,
      },
      {
        name: 'District Administration Gumla',
        type: 'government_dept',
        code: 'DC-GUMLA',
        district: 'Gumla',
        verified: true,
      },
      {
        name: 'Birla Institute of Technology (BIT Mesra)',
        type: 'participating_hei',
        code: 'BIT-MESRA',
        district: 'Ranchi',
        domains: ['Urban Infrastructure', 'IoT', 'Energy', 'Computer Science'],
        verified: true,
      },
      {
        name: 'IIT (ISM) Dhanbad',
        type: 'participating_hei',
        code: 'IIT-ISM',
        district: 'Dhanbad',
        domains: ['Mining', 'Water Management', 'Clean Energy'],
        verified: true,
      },
      {
        name: 'Tata Steel CSR Foundation',
        type: 'industry',
        code: 'TATA-STEEL',
        district: 'East Singhbhum',
        domains: ['Water Management', 'Education', 'Healthcare', 'Skill Development'],
        verified: true,
      },
      {
        name: 'Jharkhand CleanTech Innovations MSME',
        type: 'industry',
        code: 'CLEANTECH-JH',
        district: 'Ranchi',
        domains: ['Waste Management', 'Renewable Energy', 'Water Filtration'],
        verified: true,
      },
    ]);

    const bauOrg = orgs.find((o) => o.code === 'BAU-RANCHI');
    const kamdaraOrg = orgs.find((o) => o.code === 'KAMDARA-GP');
    const rmcOrg = orgs.find((o) => o.code === 'RMC-RANCHI');
    const dcGumlaOrg = orgs.find((o) => o.code === 'DC-GUMLA');
    const bitOrg = orgs.find((o) => o.code === 'BIT-MESRA');
    const iitOrg = orgs.find((o) => o.code === 'IIT-ISM');
    const tataOrg = orgs.find((o) => o.code === 'TATA-STEEL');
    const cleantechOrg = orgs.find((o) => o.code === 'CLEANTECH-JH');

    // 2. Create Users
    console.log('[Seed] Creating demo users...');
    const salt = await bcrypt.genSalt(10);
    const defaultPasswordHash = await bcrypt.hash('password123', salt);

    // CITIZENS
    const citizen = await User.create({
      name: 'Rahul Kumar',
      email: 'citizen@gumla.in',
      mobile: '9876543210',
      passwordHash: defaultPasswordHash,
      primaryRole: 'citizen',
      location: {
        district: 'Gumla',
        block: 'Kamdara',
        panchayat: 'Kamdara',
        village: 'Kamdara North',
      },
    });

    const citizenStudent = await User.create({
      name: 'Rahul Verma',
      email: 'student.rahul@gmail.com',
      mobile: '9876543219',
      passwordHash: defaultPasswordHash,
      primaryRole: 'citizen',
      location: {
        district: 'Ranchi',
        block: 'Kanke',
        panchayat: 'Arsande',
        village: 'Morabadi',
      },
    });

    // GOVERNMENT PROFILES
    const adminUser = await User.create({
      name: 'Dr. Sunita Murmu (State Innovation Secretary)',
      email: 'admin@jharkhand.gov.in',
      mobile: '9876543213',
      passwordHash: defaultPasswordHash,
      primaryRole: 'admin',
      location: { district: 'Ranchi' },
    });

    const priOfficer = await User.create({
      name: 'Sanjay Oraon (Mukhiya)',
      email: 'pri.kamdara@jharkhand.gov.in',
      mobile: '9876543211',
      passwordHash: defaultPasswordHash,
      primaryRole: 'pri',
      organizationId: kamdaraOrg._id,
      organizationName: kamdaraOrg.name,
      location: {
        district: 'Gumla',
        block: 'Kamdara',
        panchayat: 'Kamdara',
      },
    });

    const ulbOfficer = await User.create({
      name: 'Rameshwar Prasad (Municipal Commissioner)',
      email: 'ulb.ranchi@jharkhand.gov.in',
      mobile: '9876543214',
      passwordHash: defaultPasswordHash,
      primaryRole: 'pri', // Uses Local Body portal
      organizationId: rmcOrg._id,
      organizationName: rmcOrg.name,
      location: { district: 'Ranchi' },
    });

    const dcOfficer = await User.create({
      name: 'Pooja Singhal, IAS (Deputy Commissioner)',
      email: 'dc.gumla@jharkhand.gov.in',
      mobile: '9876543215',
      passwordHash: defaultPasswordHash,
      primaryRole: 'admin',
      organizationId: dcGumlaOrg._id,
      organizationName: dcGumlaOrg.name,
      location: { district: 'Gumla' },
    });

    // UNIVERSITY PROFILES
    const nodalOfficer = await User.create({
      name: 'Dr. A. K. Singh (Dean, BAU)',
      email: 'nodal.water@bau.edu.in',
      mobile: '9876543212',
      passwordHash: defaultPasswordHash,
      primaryRole: 'nodal',
      organizationId: bauOrg._id,
      organizationName: bauOrg.name,
      location: { district: 'Ranchi' },
    });

    const bitFaculty = await User.create({
      name: 'Prof. Rajiv Ranjan (HoD Electronics & IoT)',
      email: 'faculty.bit@bitmesra.ac.in',
      mobile: '9876543216',
      passwordHash: defaultPasswordHash,
      primaryRole: 'participating_hei',
      organizationId: bitOrg._id,
      organizationName: bitOrg.name,
      location: { district: 'Ranchi' },
    });

    const iitInnovator = await User.create({
      name: 'Ananya Mukherjee (Student Innovation Lead)',
      email: 'innovator@iitdhanbad.ac.in',
      mobile: '9876543217',
      passwordHash: defaultPasswordHash,
      primaryRole: 'participating_hei',
      organizationId: iitOrg._id,
      organizationName: iitOrg.name,
      location: { district: 'Dhanbad' },
    });

    // INDUSTRY PROFILES
    const industryTata = await User.create({
      name: 'Vikramaditya Sharma (Head of CSR & Sustainability)',
      email: 'csr.lead@tatasteel.com',
      mobile: '9876543218',
      passwordHash: defaultPasswordHash,
      primaryRole: 'industry',
      organizationId: tataOrg._id,
      organizationName: tataOrg.name,
      location: { district: 'East Singhbhum' },
    });

    const industryCleanTech = await User.create({
      name: 'Amitabh Roy (Managing Director, CleanTech)',
      email: 'director@cleantech-jh.in',
      mobile: '9876543220',
      passwordHash: defaultPasswordHash,
      primaryRole: 'industry',
      organizationId: cleantechOrg._id,
      organizationName: cleantechOrg.name,
      location: { district: 'Ranchi' },
    });

    // 3. Create Problems for Vertical Slice Demo
    console.log('[Seed] Creating demo problems...');
    await Problem.create([
      {
        problemId: 'JH-000001',
        title: 'Groundwater contamination and high fluoride levels in drinking wells',
        description:
          'Several hand pumps and borewells in Kamdara village are producing brackish water with high fluoride content exceeding permissible limits (2.4 PPM). Villagers, especially children, are suffering from early fluorosis and joint stiffness.',
        category: 'Water Management',
        createdBy: citizen._id,
        submitterName: citizen.name,
        location: {
          district: 'Gumla',
          block: 'Kamdara',
          panchayat: 'Kamdara',
          village: 'Kamdara North',
          coordinates: { latitude: 23.0125, longitude: 84.5218 },
        },
        evidence: [
          {
            fileUrl: '/uploads/fluoride_test.pdf',
            fileType: 'document',
            originalName: 'water_test_report_kamdara.pdf',
            caption: 'District laboratory water test report showing fluoride 2.4 PPM',
          },
        ],
        impact: {
          estimatedPopulation: 1250,
          frequency: 'Daily',
          citizenReportedSeverity: 'High',
        },
        status: 'DEPLOYED',
        assignedTo: 'BIT Mesra & CleanTech Deployment Team',
        solution: {
          universityName: 'BIT Mesra, Ranchi',
          facultyLead: 'Dr. Priya Ranjan (Dept of Chemical Engineering)',
          teamName: 'Jal-Shuddhi Innovation Team',
          solutionTitle: 'Community Solar-Powered Activated Alumina Fluoride Adsorption Plant',
          solutionSummary: 'Engineered a low-cost, decentralized fluoride removal filter that operates completely off-grid using 300W solar power. Provides 4,000 liters/day of pure water meeting BIS 10500 standards.',
          level: 5,
          levelTag: 'Deployed Solution',
          deployedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
          impactOutcome: '1,250 villagers in Kamdara now access safe fluoride-free drinking water; test fluoride level reduced from 2.4 PPM to 0.35 PPM.',
        },
        priVerification: {
          verifiedBy: priOfficer._id,
          verifierName: priOfficer.name,
          verifiedAt: new Date(Date.now() - 40 * 24 * 60 * 60 * 1000),
          isGenuine: true,
          observedPopulation: 1250,
          groundCondition: 'High fluoride verified by laboratory test report; symptoms present in children.',
          baselineData: { fluoride_ppm: 2.4 },
          remarks: 'Verified genuine emergency. PRI allocated panchayat land for plant installation.',
        },
        nodalReview: {
          reviewedBy: nodalOfficer._id,
          reviewerName: nodalOfficer.name,
          nodalOrgId: bauOrg._id,
          reviewedAt: new Date(Date.now() - 35 * 24 * 60 * 60 * 1000),
          confirmedDomain: 'Water Management',
          confirmedSeverity: 'High',
          action: 'CONVERTED_TO_MASTER',
          masterProblemId: 'MP-WATER-001',
          remarks: 'Matched with BIT Mesra chemical adsorption team for fabrication and deployment.',
        },
        timeline: [
          {
            stage: 'SUBMITTED',
            description: 'Reported by citizen Rahul Kumar from Kamdara North.',
            updatedBy: citizen._id,
            updaterName: citizen.name,
            timestamp: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000),
          },
          {
            stage: 'PRI_VERIFIED',
            description: 'Ground verified by Mukhiya Sanjay Oraon with physical water testing.',
            updatedBy: priOfficer._id,
            updaterName: priOfficer.name,
            timestamp: new Date(Date.now() - 40 * 24 * 60 * 60 * 1000),
          },
          {
            stage: 'NODAL_REVIEWED',
            description: 'Reviewed by Nodal Board; converted to Grand Challenge and assigned to BIT Mesra.',
            updatedBy: nodalOfficer._id,
            updaterName: nodalOfficer.name,
            timestamp: new Date(Date.now() - 35 * 24 * 60 * 60 * 1000),
          },
          {
            stage: 'PROTOTYPE_READY',
            description: 'BIT Mesra team completed fabrication of 4000L/day solar adsorption unit.',
            updaterName: 'BIT Mesra Research Cell',
            timestamp: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000),
          },
          {
            stage: 'PILOT_TESTING',
            description: '14-day continuous pilot trial completed with 100% water quality compliance.',
            updaterName: 'District Water & Sanitation Mission',
            timestamp: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
          },
          {
            stage: 'DEPLOYED',
            description: 'Full plant commissioned on site; handing over maintenance to village pani samiti.',
            updaterName: 'State Innovation Mission',
            timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
          },
        ],
      },
      {
        problemId: 'JH-000002',
        title: 'Soil erosion and heavy siltation blocking irrigation check-dam',
        description:
          'Monsoon run-off has washed topsoil and sediment into the minor irrigation canal and check-dam, reducing storage capacity by 60% and depriving 120 smallholder farming families of winter irrigation.',
        category: 'Agriculture',
        createdBy: citizen._id,
        submitterName: citizen.name,
        location: {
          district: 'Gumla',
          block: 'Kamdara',
          panchayat: 'Kamdara',
          village: 'Barigaon',
          coordinates: { latitude: 23.0311, longitude: 84.5422 },
        },
        impact: {
          estimatedPopulation: 600,
          frequency: 'Seasonal',
          citizenReportedSeverity: 'Medium',
        },
        status: 'PILOT_TESTING',
        assignedTo: 'Birsa Agricultural University (BAU) Field Team',
        solution: {
          universityName: 'Birsa Agricultural University (BAU)',
          facultyLead: 'Dr. Rameshwar Mahto (Soil & Water Conservation Dept)',
          teamName: 'Krishi-Setu Lab',
          solutionTitle: 'Vetiver Bio-Engineering Barrier & Automated Silt Gate Release Mechanism',
          solutionSummary: 'Implemented deep-root vetiver bio-bunding on upstream slopes combined with a weighted buoyancy sluice gate that purges sediment automatically during high flow.',
          level: 4,
          levelTag: 'Field Testing',
          impactOutcome: 'Check-dam storage capacity restored by 45% during pre-monsoon trials; 70 farmers participating in current pilot test.',
        },
        priVerification: {
          verifiedBy: priOfficer._id,
          verifierName: priOfficer.name,
          verifiedAt: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000),
          isGenuine: true,
          observedPopulation: 600,
          groundCondition: 'Check dam reservoir silt depth measured at 1.8 meters, severely choking irrigation flow.',
          remarks: 'Verified genuine. Recommended for agricultural engineering intervention.',
        },
        nodalReview: {
          reviewedBy: nodalOfficer._id,
          reviewerName: nodalOfficer.name,
          nodalOrgId: bauOrg._id,
          reviewedAt: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000),
          confirmedDomain: 'Agriculture',
          confirmedSeverity: 'Medium',
          action: 'ACCEPTED',
          remarks: 'Adopted directly by BAU Agronomy and Agricultural Engineering division.',
        },
        timeline: [
          {
            stage: 'SUBMITTED',
            description: 'Reported by citizen Rahul Kumar from Barigaon.',
            updatedBy: citizen._id,
            updaterName: citizen.name,
            timestamp: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
          },
          {
            stage: 'PRI_VERIFIED',
            description: 'PRI inspection confirmed critical desiltation need for 600 villagers.',
            updatedBy: priOfficer._id,
            updaterName: priOfficer.name,
            timestamp: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000),
          },
          {
            stage: 'NODAL_REVIEWED',
            description: 'Nodal authority approved pilot intervention by Birsa Agricultural University.',
            updatedBy: nodalOfficer._id,
            updaterName: nodalOfficer.name,
            timestamp: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000),
          },
          {
            stage: 'PILOT_TESTING',
            description: 'Experimental bio-engineering bunds planted; automated gate installed for field trials.',
            updaterName: 'BAU Agro-Tech Lab',
            timestamp: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000),
          },
        ],
      },
      {
        problemId: 'JH-000003',
        title: 'Severe arsenic & iron traces in primary school tube-well',
        description:
          'Water from the school tube-well in Kamdara Central has visible reddish precipitate and testing indicates iron levels > 3.0 mg/L. Safe drinking water is urgently needed for 240 students and mid-day meal kitchen.',
        category: 'Healthcare',
        createdBy: citizen._id,
        submitterName: citizen.name,
        location: {
          district: 'Gumla',
          block: 'Kamdara',
          panchayat: 'Kamdara',
          village: 'Kamdara Central',
          coordinates: { latitude: 23.0245, longitude: 84.5312 },
        },
        impact: {
          estimatedPopulation: 450,
          frequency: 'Daily',
          citizenReportedSeverity: 'Critical',
        },
        status: 'PROTOTYPE_READY',
        assignedTo: 'IIT (ISM) Dhanbad Department of Environmental Engineering',
        solution: {
          universityName: 'IIT (ISM) Dhanbad',
          facultyLead: 'Prof. Alok Sinha (Environmental Science & Engineering)',
          teamName: 'CleanWater Innovators',
          solutionTitle: 'Zero-Electricity Multi-Stage Sand & Iron-Oxide Adsorption Column',
          solutionSummary: 'Engineered gravity-fed filtration unit utilizing locally sourced zero-valent iron shavings and activated quartz sand to bring iron levels < 0.3 mg/L with zero electricity.',
          level: 3,
          levelTag: 'Prototype Created',
          impactOutcome: 'Prototype bench testing achieved 96.8% iron removal and complete turbidity clearance; ready for school deployment.',
        },
        priVerification: {
          verifiedBy: priOfficer._id,
          verifierName: priOfficer.name,
          verifiedAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000),
          isGenuine: true,
          observedPopulation: 450,
          groundCondition: 'Tube-well pump water smells strongly of rust; students are fetching water from 1.5 km away.',
          baselineData: { iron_ppm: 3.2, ph_level: 6.2 },
          remarks: 'Urgent priority. Needs low-cost decentralized water filtration pilot.',
        },
        nodalReview: {
          reviewedBy: nodalOfficer._id,
          reviewerName: nodalOfficer.name,
          nodalOrgId: bauOrg._id,
          reviewedAt: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000),
          confirmedDomain: 'Healthcare',
          confirmedSeverity: 'Critical',
          action: 'ACCEPTED',
          remarks: 'Selected for immediate HEI prototype challenge with IIT Dhanbad team.',
        },
        timeline: [
          {
            stage: 'SUBMITTED',
            description: 'Reported by Rahul Kumar for Primary School Kamdara Central.',
            updatedBy: citizen._id,
            updaterName: citizen.name,
            timestamp: new Date(Date.now() - 18 * 24 * 60 * 60 * 1000),
          },
          {
            stage: 'PRI_VERIFIED',
            description: 'Physical inspection by Mukhiya confirmed iron levels > 3.0 mg/L.',
            updatedBy: priOfficer._id,
            updaterName: priOfficer.name,
            timestamp: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000),
          },
          {
            stage: 'NODAL_REVIEWED',
            description: 'Classified as Critical Healthcare Challenge; assigned to IIT Dhanbad team.',
            updatedBy: nodalOfficer._id,
            updaterName: nodalOfficer.name,
            timestamp: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000),
          },
          {
            stage: 'PROTOTYPE_READY',
            description: 'Zero-electricity adsorption column prototype completed lab testing with 96.8% removal.',
            updaterName: 'IIT Dhanbad Lab',
            timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
          },
        ],
      },
      {
        problemId: 'JH-000004',
        title: 'Non-functional Solar Micro-grid and street lighting in rural tribal hamlet',
        description:
          'Battery inverters in the village solar micro-grid failed after lightning surges, leaving 85 tribal households without electricity and main road illumination for three weeks.',
        category: 'Energy',
        createdBy: citizen._id,
        submitterName: citizen.name,
        location: {
          district: 'Gumla',
          block: 'Kamdara',
          panchayat: 'Kamdara',
          village: 'Belsiyari',
          coordinates: { latitude: 22.9812, longitude: 84.4921 },
        },
        impact: {
          estimatedPopulation: 380,
          frequency: 'Daily',
          citizenReportedSeverity: 'High',
        },
        status: 'MASTER_PROBLEM_CREATED',
        assignedTo: 'NIT Jamshedpur Renewable Energy & Smart Grid Research Cell',
        solution: {
          universityName: 'NIT Jamshedpur',
          facultyLead: 'Dr. Niranjan Kumar (Dept of Electrical Engineering)',
          teamName: 'Urja-Vikas Hub',
          solutionTitle: 'Smart IoT Surge-Resilient Hybrid Micro-Grid Inverter with Battery Balancer',
          solutionSummary: 'Designing a ruggedized inverter featuring optical isolation and multi-stage metal oxide varistor surge suppressors tailored for Chota Nagpur lightning conditions.',
          level: 2,
          levelTag: 'University Adopted',
          impactOutcome: 'R&D adopted by 4 post-graduate researchers; hardware architecture finalized.',
        },
        priVerification: {
          verifiedBy: priOfficer._id,
          verifierName: priOfficer.name,
          verifiedAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
          isGenuine: true,
          observedPopulation: 380,
          groundCondition: 'Both 5kVA inverters fried by voltage spikes. Villagers using kerosene lamps.',
          remarks: 'High priority. Verified by Panchayat Ward member.',
        },
        nodalReview: {
          reviewedBy: nodalOfficer._id,
          reviewerName: nodalOfficer.name,
          nodalOrgId: bauOrg._id,
          reviewedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
          confirmedDomain: 'Energy',
          confirmedSeverity: 'High',
          action: 'CONVERTED_TO_MASTER',
          masterProblemId: 'MP-ENERGY-004',
          remarks: 'Adopted by NIT Jamshedpur Electrical Department under State Innovation Challenge.',
        },
        timeline: [
          {
            stage: 'SUBMITTED',
            description: 'Reported by Rahul Kumar for Belsiyari hamlet.',
            updatedBy: citizen._id,
            updaterName: citizen.name,
            timestamp: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000),
          },
          {
            stage: 'PRI_VERIFIED',
            description: 'Panchayat ground verification confirmed grid failure caused by lightning strike.',
            updatedBy: priOfficer._id,
            updaterName: priOfficer.name,
            timestamp: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
          },
          {
            stage: 'NODAL_REVIEWED',
            description: 'Adopted by NIT Jamshedpur research cell for IoT surge protection architecture.',
            updatedBy: nodalOfficer._id,
            updaterName: nodalOfficer.name,
            timestamp: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
          },
        ],
      },
      {
        problemId: 'JH-000005',
        title: 'Lack of temperature-controlled storage causing post-harvest decay of Lac & Mahua',
        description:
          'Over 400 tribal forest produce gatherers lose 30-40% of their seasonal Lac and Mahua crop due to humidity fungus and lack of decentralized solar cold storage at the village level.',
        category: 'Environment',
        createdBy: citizen._id,
        submitterName: citizen.name,
        location: {
          district: 'Ranchi',
          block: 'Angara',
          panchayat: 'Getalsud',
          village: 'Getalsud East',
          coordinates: { latitude: 23.4512, longitude: 85.5213 },
        },
        impact: {
          estimatedPopulation: 850,
          frequency: 'Seasonal',
          citizenReportedSeverity: 'High',
        },
        status: 'PRI_VERIFIED',
        assignedTo: 'Ranchi District Rural Innovation Cell',
        solution: {
          universityName: 'Ranchi University & ICAR-IINRG (Namkum)',
          facultyLead: 'Pending Faculty Assignment',
          teamName: 'Tribal Livelihood Taskforce',
          solutionTitle: 'Phase Change Material (PCM) Solar Cold Micro-Storage Unit',
          solutionSummary: 'Selected for university innovation challenge to develop thermal PCM cold storage boxes preserving forest produce for up to 90 days.',
          level: 1,
          levelTag: 'Verified',
          impactOutcome: 'Ground validation complete; problem statement published to all 47 state universities.',
        },
        priVerification: {
          verifiedBy: priOfficer._id,
          verifierName: 'Getalsud Gram Mukhiya',
          verifiedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
          isGenuine: true,
          observedPopulation: 850,
          groundCondition: 'Heavy post-harvest fungal damage verified; tribal collectors receiving depressed distress prices.',
          remarks: 'Verified genuine grievance. Strong candidate for agro-forestry engineering solution.',
        },
        timeline: [
          {
            stage: 'SUBMITTED',
            description: 'Reported by forest produce gatherers cooperative.',
            updatedBy: citizen._id,
            updaterName: 'Citizen Representative',
            timestamp: new Date(Date.now() - 9 * 24 * 60 * 60 * 1000),
          },
          {
            stage: 'PRI_VERIFIED',
            description: 'Ground verified by Mukhiya and approved for state university challenge call.',
            updatedBy: priOfficer._id,
            updaterName: 'Local Administration',
            timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
          },
        ],
      },
      {
        problemId: 'JH-000006',
        title: 'Open storm-water drain overflow creating urban mosquito vector hazard',
        description:
          'Stagnant waste water overflows onto residential streets in Harmu colony during rain bursts, triggering recurring dengue and malaria cases among 2,200 residents.',
        category: 'Urban Infrastructure',
        createdBy: citizen._id,
        submitterName: 'Ranchi Ward Resident',
        location: {
          district: 'Ranchi',
          block: 'Ranchi Urban',
          panchayat: 'Harmu',
          village: 'Harmu Housing Colony',
          coordinates: { latitude: 23.3619, longitude: 85.3129 },
        },
        impact: {
          estimatedPopulation: 2200,
          frequency: 'Weekly',
          citizenReportedSeverity: 'Critical',
        },
        status: 'DEPLOYED',
        assignedTo: 'Ranchi Municipal Corporation & BIT Lalpur Bio-Team',
        solution: {
          universityName: 'BIT Lalpur & RIMS Community Medicine',
          facultyLead: 'Dr. Vivek Sharma',
          teamName: 'Urban Eco-Shield',
          solutionTitle: 'Modular Bio-Enzymatic Silt Trap & Larvicidal Floating Vegetation Mat',
          solutionSummary: 'Installed natural enzyme dosing pods and vetiver wetland mats that digest organic waste sludge and eliminate mosquito breeding without toxic chemicals.',
          level: 5,
          levelTag: 'Deployed Solution',
          deployedAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000),
          impactOutcome: 'Zero overflow incidents recorded in last 3 weeks; vector larvae counts reduced by 94% across 800m drainage stretch.',
        },
        priVerification: {
          verifiedBy: priOfficer._id,
          verifierName: 'RMC Ward Councillor',
          verifiedAt: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000),
          isGenuine: true,
          observedPopulation: 2200,
          groundCondition: 'Critical drainage choke point verified physically.',
          remarks: 'Approved for fast-track urban civic innovation.',
        },
        timeline: [
          {
            stage: 'SUBMITTED',
            description: 'Reported by Harmu Citizens Welfare Association.',
            updaterName: 'Citizen Submitter',
            timestamp: new Date(Date.now() - 70 * 24 * 60 * 60 * 1000),
          },
          {
            stage: 'PRI_VERIFIED',
            description: 'Verified by Ranchi Municipal Corporation urban engineer.',
            updaterName: 'RMC Inspector',
            timestamp: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000),
          },
          {
            stage: 'NODAL_REVIEWED',
            description: 'Adopted under Urban Resilience initiative with BIT Lalpur team.',
            updaterName: 'Urban Nodal Cell',
            timestamp: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000),
          },
          {
            stage: 'DEPLOYED',
            description: 'Bio-filtration mats and enzyme pods installed and functioning on site.',
            updaterName: 'RMC & BIT Lalpur',
            timestamp: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000),
          },
        ],
      },
    ]);

    console.log('\n[Seed Success] Successfully seeded MongoDB Atlas with 10 user profiles across all sectors.');
    process.exit(0);
  } catch (error) {
    console.error('[Seed Error]:', error);
    process.exit(1);
  }
};

seedData();
