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
          estimatedPopulation: 350,
          frequency: 'Daily',
          citizenReportedSeverity: 'High',
        },
        status: 'SUBMITTED',
        assignedTo: 'Kamdara Gram Panchayat',
        timeline: [
          {
            stage: 'SUBMITTED',
            description: 'Problem reported by citizen Rahul Kumar from Kamdara North.',
            updatedBy: citizen._id,
            updaterName: citizen.name,
            timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
          },
        ],
      },
      {
        problemId: 'JH-000002',
        title: 'Soil erosion and heavy siltation blocking irrigation check-dam',
        description:
          'Heavy monsoon run-off has washed topsoil and sediment into the minor irrigation canal and check-dam, reducing storage capacity by 60% and depriving 120 smallholder farming families of irrigation.',
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
        status: 'PRI_VERIFICATION_PENDING',
        assignedTo: 'Kamdara Gram Panchayat',
        timeline: [
          {
            stage: 'SUBMITTED',
            description: 'Problem reported by citizen Rahul Kumar from Barigaon.',
            updatedBy: citizen._id,
            updaterName: citizen.name,
            timestamp: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000),
          },
          {
            stage: 'PRI_VERIFICATION_PENDING',
            description: 'Queued for ground inspection by Mukhiya Sanjay Oraon.',
            updatedBy: priOfficer._id,
            updaterName: 'System',
            timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
          },
        ],
      },
      {
        problemId: 'JH-000003',
        title: 'Severe arsenic & iron traces in primary school tube-well',
        description:
          'Water from the school tube-well in Kamdara Central has visible reddish precipitate and testing indicates iron levels > 3.0 mg/L. Safe drinking water is urgently needed for 240 students.',
        category: 'Water Management',
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
        status: 'PRI_VERIFIED',
        assignedTo: 'Nodal HEI Orchestration Pending (BAU)',
        priVerification: {
          verifiedBy: priOfficer._id,
          verifierName: priOfficer.name,
          verifiedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
          isGenuine: true,
          observedPopulation: 450,
          groundCondition: 'Tube-well pump water smells strongly of rust; students are fetching water from 1.5 km away.',
          baselineData: {
            iron_ppm: 3.2,
            ph_level: 6.2,
            water_availability_hrs: 2,
          },
          remarks: 'Urgent priority. Needs low-cost decentralized water filtration pilot.',
        },
        timeline: [
          {
            stage: 'SUBMITTED',
            description: 'Reported by Rahul Kumar.',
            updatedBy: citizen._id,
            updaterName: citizen.name,
            timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
          },
          {
            stage: 'PRI_VERIFIED',
            description: 'Ground verified by Mukhiya Sanjay Oraon with physical water samples.',
            updatedBy: priOfficer._id,
            updaterName: priOfficer.name,
            timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
          },
        ],
      },
      {
        problemId: 'JH-000004',
        title: 'Non-functional Solar Micro-grid and street lighting in rural hamlet',
        description:
          'Battery inverters in the solar micro-grid have failed after lightning strikes, leaving 85 tribal households without electricity and street illumination for 3 weeks.',
        category: 'Energy',
        createdBy: citizen._id,
        submitterName: citizen.name,
        location: {
          district: 'Gumla',
          block: 'Kamdara',
          panchayat: 'Kamdara',
          village: 'Belsiyari',
        },
        impact: {
          estimatedPopulation: 380,
          frequency: 'Daily',
          citizenReportedSeverity: 'High',
        },
        status: 'SUBMITTED',
        assignedTo: 'Kamdara Gram Panchayat',
        timeline: [
          {
            stage: 'SUBMITTED',
            description: 'Reported by Rahul Kumar.',
            updatedBy: citizen._id,
            updaterName: citizen.name,
            timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
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
