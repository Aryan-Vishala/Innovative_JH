import { ORG_TYPES, USER_ROLES, PROBLEM_STATES, SEVERITY_LEVELS, URGENCY_LEVELS, METRIC_DIRECTIONS, IP_STATUSES } from '../config/constants.js';

export const initialOrganizations = [
  {
    id: 'org-bau',
    name: 'Birsa Agricultural University (BAU)',
    type: ORG_TYPES.NODAL_HEI,
    district: 'Ranchi',
    website: 'https://www.bauranchi.org',
    verified: true,
    accreditationRating: 4.8,
    primaryDomain: 'water_resources',
    pci: {
      domain: 'water_resources',
      score: 92,
      breakdown: {
        facultyCount: 28,
        facultyExpertise: 'Hydrology, Soil Water Conservation, Agronomy',
        labs: ['Central Hydrology & Irrigation Lab', 'Soil & Water Testing Facility', 'Remote Sensing & GIS Centre'],
        completedProjects: 19,
        patents: 4,
        districtPresence: ['Gumla', 'Ranchi', 'Khunti', 'Simdega']
      }
    }
  },
  {
    id: 'org-bit',
    name: 'Birla Institute of Technology (BIT) Mesra',
    type: ORG_TYPES.PARTICIPATING_HEI,
    district: 'Ranchi',
    website: 'https://www.bitmesra.ac.in',
    verified: true,
    accreditationRating: 4.9,
    primaryDomain: 'urban_iot',
    pci: {
      domain: 'urban_iot',
      score: 94,
      breakdown: {
        facultyCount: 34,
        facultyExpertise: 'IoT Sensors, Embedded Microelectronics, Telecommunications, AI/ML',
        labs: ['Embedded Systems & IoT Innovation Centre', 'Thin Film Sensor Fabrication Lab', 'High Performance Computing Cluster'],
        completedProjects: 24,
        patents: 8,
        districtPresence: ['Ranchi', 'Ramgarh', 'Hazaribagh']
      }
    }
  },
  {
    id: 'org-iit-ism',
    name: 'IIT (ISM) Dhanbad',
    type: ORG_TYPES.NODAL_HEI,
    district: 'Dhanbad',
    website: 'https://www.iitism.ac.in',
    verified: true,
    accreditationRating: 4.95,
    primaryDomain: 'environment_mining',
    pci: {
      domain: 'environment_mining',
      score: 96,
      breakdown: {
        facultyCount: 42,
        facultyExpertise: 'Heavy Metal & Fluoride Contamination, Hydrogeology, Geochemistry',
        labs: ['Centre for Environmental Water Quality', 'Advanced Spectroscopy Lab', 'Subsurface Hydrology Simulation Lab'],
        completedProjects: 31,
        patents: 11,
        districtPresence: ['Dhanbad', 'Bokaro', 'Giridih']
      }
    }
  },
  {
    id: 'org-aiims',
    name: 'AIIMS Deoghar',
    type: ORG_TYPES.NODAL_HEI,
    district: 'Deoghar',
    website: 'https://www.aiimsdeoghar.edu.in',
    verified: true,
    accreditationRating: 4.85,
    primaryDomain: 'healthcare',
    pci: {
      domain: 'healthcare',
      score: 93,
      breakdown: {
        facultyCount: 26,
        facultyExpertise: 'Community Medicine, Waterborne Toxicology, Skeletal Fluorosis Pathology',
        labs: ['Epidemiology & Community Health Field Lab', 'Clinical Pathology & Toxicology Diagnostics'],
        completedProjects: 12,
        patents: 2,
        districtPresence: ['Deoghar', 'Dumka', 'Godda']
      }
    }
  },
  {
    id: 'org-jalshakti',
    name: 'Jalshakti IoT Technologies Pvt Ltd',
    type: ORG_TYPES.INDUSTRY_STARTUP,
    district: 'Ranchi',
    website: 'https://www.jalshakti-iot.in',
    verified: true,
    accreditationRating: 4.6,
    primaryDomain: 'water_resources',
    pci: {
      domain: 'water_resources',
      score: 87,
      breakdown: {
        facultyCount: 14,
        facultyExpertise: 'Solar LoRaWAN Telemetry, Industrial Firmware, Cloud Pipelines',
        labs: ['Hardware Prototyping Workshop', 'LoRa Field Testing Rig'],
        completedProjects: 8,
        patents: 3,
        districtPresence: ['Ranchi', 'Gumla', 'Lohardaga']
      }
    }
  },
  {
    id: 'org-tata-steel',
    name: 'Tata Steel CSR & Rural Technology Cell',
    type: ORG_TYPES.INDUSTRY_STARTUP,
    district: 'East Singhbhum (Jamshedpur)',
    website: 'https://www.tatasteel.com',
    verified: true,
    accreditationRating: 5.0,
    primaryDomain: 'rural_livelihoods',
    pci: {
      domain: 'rural_livelihoods',
      score: 95,
      breakdown: {
        facultyCount: 50,
        facultyExpertise: 'Heavy Fabrication, CSR Capital Grants, Rural Water Tanks Deployment',
        labs: ['Industrial Rapid Manufacturing Facility', 'Materials Testing Lab'],
        completedProjects: 45,
        patents: 22,
        districtPresence: ['East Singhbhum', 'West Singhbhum', 'Seraikela Kharsawan']
      }
    }
  },
  {
    id: 'org-kamdara-pri',
    name: 'Kamdara Gram Panchayat & Block Office',
    type: ORG_TYPES.PRI_LOCAL_BODY,
    district: 'Gumla',
    website: 'https://gumla.nic.in/kamdara',
    verified: true,
    accreditationRating: 4.5,
    primaryDomain: 'water_resources',
    pci: {
      domain: 'water_resources',
      score: 80,
      breakdown: {
        facultyCount: 6,
        facultyExpertise: 'Gram Sabha Administration, Land Clearance, Community Water Committee',
        labs: ['Field Jal Suraksha Kendra'],
        completedProjects: 5,
        patents: 0,
        districtPresence: ['Gumla']
      }
    }
  },
  {
    id: 'org-dhte',
    name: 'Department of Higher & Technical Education (DHTE), Govt of Jharkhand',
    type: ORG_TYPES.STATE_GOVT,
    district: 'Ranchi',
    website: 'https://jharkhand.gov.in/dhte',
    verified: true,
    accreditationRating: 5.0,
    primaryDomain: 'water_resources',
    pci: {
      domain: 'water_resources',
      score: 99,
      breakdown: {
        facultyCount: 15,
        facultyExpertise: 'State Innovation Policy, Higher Education Grants, NEP 2020 Accreditation',
        labs: ['State Innovation Telemetry Repository'],
        completedProjects: 120,
        patents: 0,
        districtPresence: ['All 24 Districts']
      }
    }
  }
];

export const initialUsers = [
  {
    id: 'usr-citizen-ramesh',
    email: 'ramesh.gumla@jharkhand.in',
    passwordHash: '$2a$10$w8T0MvI81s8J6Mv3.eQ6te0gLd6gU6Dq8G5QYF9A7uR9a3o6m2O2i', // password123
    fullName: 'Ramesh Munda',
    phone: '+91 94312 87654',
    role: USER_ROLES.CITIZEN,
    organizationId: 'org-kamdara-pri',
    organizationName: 'Kamdara Gram Sabha',
    district: 'Gumla',
    village: 'Kamdara Toli',
    avatar: '👨‍🌾'
  },
  {
    id: 'usr-pri-sunita',
    email: 'sunita.pri@gumla.gov.in',
    passwordHash: '$2a$10$w8T0MvI81s8J6Mv3.eQ6te0gLd6gU6Dq8G5QYF9A7uR9a3o6m2O2i',
    fullName: 'Sunita Oraon',
    phone: '+91 98351 23456',
    role: USER_ROLES.PRI_OFFICER,
    organizationId: 'org-kamdara-pri',
    organizationName: 'Kamdara Gram Panchayat',
    district: 'Gumla',
    designation: 'Panchayat Secretary',
    avatar: '👩‍💼'
  },
  {
    id: 'usr-nodal-arvind',
    email: 'arvind.nodal@bau.edu.in',
    passwordHash: '$2a$10$w8T0MvI81s8J6Mv3.eQ6te0gLd6gU6Dq8G5QYF9A7uR9a3o6m2O2i',
    fullName: 'Dr. Arvind Swaminathan',
    phone: '+91 94311 54321',
    role: USER_ROLES.NODAL_DIRECTOR,
    organizationId: 'org-bau',
    organizationName: 'Birsa Agricultural University (BAU)',
    district: 'Ranchi',
    designation: 'Director of Collaborative Innovation & Hydrology',
    avatar: '👨‍🏫'
  },
  {
    id: 'usr-faculty-preeti',
    email: 'preeti.sinha@bitmesra.ac.in',
    passwordHash: '$2a$10$w8T0MvI81s8J6Mv3.eQ6te0gLd6gU6Dq8G5QYF9A7uR9a3o6m2O2i',
    fullName: 'Dr. Preeti Sinha',
    phone: '+91 94313 11223',
    role: USER_ROLES.FACULTY,
    organizationId: 'org-bit',
    organizationName: 'BIT Mesra Ranchi',
    district: 'Ranchi',
    designation: 'Associate Professor, IoT & Embedded Lab Lead',
    avatar: '👩‍🔬'
  },
  {
    id: 'usr-student-aryan',
    email: 'aryan.student@bitmesra.ac.in',
    passwordHash: '$2a$10$w8T0MvI81s8J6Mv3.eQ6te0gLd6gU6Dq8G5QYF9A7uR9a3o6m2O2i',
    fullName: 'Aryan Kumar',
    phone: '+91 91234 56789',
    role: USER_ROLES.STUDENT,
    organizationId: 'org-bit',
    organizationName: 'BIT Mesra Ranchi',
    district: 'Ranchi',
    designation: 'Final Year Lead Student Researcher (IoT)',
    avatar: '🎓'
  },
  {
    id: 'usr-industry-rajesh',
    email: 'rajesh.v@jalshakti-iot.in',
    passwordHash: '$2a$10$w8T0MvI81s8J6Mv3.eQ6te0gLd6gU6Dq8G5QYF9A7uR9a3o6m2O2i',
    fullName: 'Rajesh Varma',
    phone: '+91 98350 99887',
    role: USER_ROLES.INDUSTRY_EXPERT,
    organizationId: 'org-jalshakti',
    organizationName: 'Jalshakti IoT Technologies',
    district: 'Ranchi',
    designation: 'Founder & Head of Industrial Systems',
    avatar: '👨‍💻'
  },
  {
    id: 'usr-admin-vivek',
    email: 'vivek.admin@jharkhand.gov.in',
    passwordHash: '$2a$10$w8T0MvI81s8J6Mv3.eQ6te0gLd6gU6Dq8G5QYF9A7uR9a3o6m2O2i',
    fullName: 'Dr. Vivek Murmu, IAS',
    phone: '+91 94310 00001',
    role: USER_ROLES.STATE_ADMIN,
    organizationId: 'org-dhte',
    organizationName: 'Govt of Jharkhand (DHTE)',
    district: 'Ranchi',
    designation: 'Special Secretary & State Innovation Mission Director',
    avatar: '🏛️'
  }
];

export const initialDomainMappings = [
  {
    id: 'dom-map-water',
    domainKey: 'water_resources',
    displayName: 'Water Resources & Quality Management',
    nodalOrganizationId: 'org-bau',
    backupNodalOrgId: 'org-iit-ism',
    assignedByAdminId: 'usr-admin-vivek',
    activeFrom: '2026-01-15T00:00:00.000Z',
    isActive: true
  },
  {
    id: 'dom-map-agri',
    domainKey: 'agriculture',
    displayName: 'Smart Agriculture & Soil Health',
    nodalOrganizationId: 'org-bau',
    backupNodalOrgId: 'org-bit',
    assignedByAdminId: 'usr-admin-vivek',
    activeFrom: '2026-01-15T00:00:00.000Z',
    isActive: true
  },
  {
    id: 'dom-map-health',
    domainKey: 'healthcare',
    displayName: 'Rural Public Health & Sanitation',
    nodalOrganizationId: 'org-aiims',
    backupNodalOrgId: 'org-bau',
    assignedByAdminId: 'usr-admin-vivek',
    activeFrom: '2026-01-15T00:00:00.000Z',
    isActive: true
  },
  {
    id: 'dom-map-env',
    domainKey: 'environment_mining',
    displayName: 'Environment, Hydrology & Mining Reclamation',
    nodalOrganizationId: 'org-iit-ism',
    backupNodalOrgId: 'org-bit',
    assignedByAdminId: 'usr-admin-vivek',
    activeFrom: '2026-01-15T00:00:00.000Z',
    isActive: true
  },
  {
    id: 'dom-map-iot',
    domainKey: 'urban_iot',
    displayName: 'Urban Infrastructure, IoT & Energy',
    nodalOrganizationId: 'org-bit',
    backupNodalOrgId: 'org-iit-ism',
    assignedByAdminId: 'usr-admin-vivek',
    activeFrom: '2026-01-15T00:00:00.000Z',
    isActive: true
  }
];

export const initialProblems = [
  {
    id: 'prob-gumla-wtr-01',
    code: 'JH-WTR-2026-01',
    title: 'Severe Groundwater Depletion and Dangerous Fluoride Contamination in Kamdara',
    description: 'Borewells in Kamdara Block are drying up rapidly every summer with water table dropping to 48 metres. Villagers only get 3 hours of water access daily. Furthermore, local health tests report severe fluoride contamination (4.2 PPM against permissible 1.0 PPM), resulting in early skeletal fluorosis, joint pain, and dental degradation among 120+ school children across 4 neighboring villages.',
    thematicDomain: 'water_resources',
    subdomain: 'Groundwater Quantity & Hydrochemistry',
    dualThemes: {
      quantity: {
        issue: 'Groundwater Table Depletion & Pumping Deficit',
        baselineMetric: '3.0 Hours/Day potable water supply',
        targetMetric: '8.0 Hours/Day continuous solar-assisted supply'
      },
      quality: {
        issue: 'Toxic High Fluoride Concentration',
        baselineMetric: '4.2 PPM Fluoride',
        targetMetric: '< 1.0 PPM Permissible Standard'
      }
    },
    citizenUserId: 'usr-citizen-ramesh',
    citizenName: 'Ramesh Munda',
    district: 'Gumla',
    block: 'Kamdara',
    panchayat: 'Kamdara Gram Panchayat',
    latitude: 22.8834,
    longitude: 84.9123,
    severityLevel: SEVERITY_LEVELS.CRITICAL,
    urgencyLevel: URGENCY_LEVELS.HIGH,
    affectedPopulation: 2400,
    status: PROBLEM_STATES.SUBMITTED,
    priValidated: false,
    priValidationRemarks: null,
    priValidatedAt: null,
    evidence: [
      {
        id: 'evi-01',
        type: 'image',
        url: 'https://images.unsplash.com/photo-1541888946425-d0fbb1861593?auto=format&fit=crop&w=800&q=80',
        caption: 'Dry community handpump and cracked soil in Kamdara Toli'
      },
      {
        id: 'evi-02',
        type: 'document',
        url: 'https://example.com/gumla_fluoride_lab_report.pdf',
        caption: 'Public Health Engineering Dept (PHED) Fluoride Assay Test (4.2 PPM recorded)'
      }
    ],
    aiAnalysis: {
      predictedDomain: 'water_resources',
      predictedSubdomain: 'Groundwater Depletion & Fluoride Quality',
      confidenceScore: 94.2,
      extractedKeywords: ['groundwater', 'fluoride', 'depletion', 'pumping hours', 'fluorosis', 'water table', 'filtration', 'IoT telemetry'],
      requiredExpertise: {
        'IoT_Sensors': 30,
        'Hydrology_WaterResources': 30,
        'Chemical_Filtration': 20,
        'Cloud_MobileApp': 20
      },
      severityScore: 91,
      duplicateClusterId: null,
      similarityScore: 12.4, // Unique master problem candidate
      suggestedNodalOrgId: 'org-bau',
      analysisTimestamp: '2026-02-10T09:30:00.000Z'
    },
    createdAt: '2026-02-10T09:15:00.000Z'
  }
];
