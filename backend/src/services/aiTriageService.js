/**
 * AI Triage & Capability Matcher Service
 * Communicates with friend's FastAPI microservice (http://localhost:8000)
 * Includes an intelligent fallback rule-based semantic engine for offline demo resilience.
 */

const fallbackTriageEngine = (title = '', description = '', category = '', district = '') => {
  const text = `${title} ${description} ${category}`.toLowerCase();

  // 1. Water Quality / Contamination
  if (
    text.includes('water') ||
    text.includes('fluoride') ||
    text.includes('rust') ||
    text.includes('arsenic') ||
    text.includes('borewell') ||
    text.includes('drinking') ||
    text.includes('pump') ||
    text.includes('smell') ||
    text.includes('brackish')
  ) {
    const isCritical = text.includes('arsenic') || text.includes('child') || text.includes('poison') || text.includes('death');
    return {
      detectedDomain: 'Water Contamination',
      subdomain: 'Groundwater Heavy Metal & Chemical Pollutants',
      severity: isCritical ? 'Critical Severity' : 'High Severity',
      severityScore: isCritical ? 95 : 88,
      sdgs: [
        { code: 'SDG 6', name: 'Clean Water & Sanitation' },
        { code: 'SDG 3', name: 'Good Health' },
      ],
      recommendedUniversity: {
        name: 'Birsa Agricultural University',
        department: 'Dept of Hydrology',
        matchScore: 94,
        rationale: 'Active research on decentralized fluoride & iron removal filters in Jharkhand rural belts.',
      },
      recommendedIndustry: {
        name: 'Tata Steel Foundation',
        mission: 'Water & Health CSR Mission',
        matchScore: 91,
        pledgeTypes: ['Clean Water Filtration Plants', 'Community RO Plants', 'Water Testing Kits'],
      },
      requiredExpertise: ['Hydrology', 'Water Chemistry', 'Adsorption Filtration', 'IoT Water Quality Sensors'],
      aiConfidence: 93,
    };
  }

  // 2. Agriculture / Irrigation / Soil
  if (
    text.includes('soil') ||
    text.includes('crop') ||
    text.includes('irrigation') ||
    text.includes('canal') ||
    text.includes('farmer') ||
    text.includes('farm') ||
    text.includes('drought') ||
    text.includes('silt') ||
    text.includes('pest')
  ) {
    return {
      detectedDomain: 'Agricultural Infrastructure & Soil Health',
      subdomain: 'Micro-Irrigation & Soil Sedimentation Control',
      severity: 'High Severity',
      severityScore: 82,
      sdgs: [
        { code: 'SDG 2', name: 'Zero Hunger' },
        { code: 'SDG 13', name: 'Climate Action' },
      ],
      recommendedUniversity: {
        name: 'Birsa Agricultural University (BAU)',
        department: 'Faculty of Agricultural Engineering & Agronomy',
        matchScore: 96,
        rationale: 'Specialized faculty in check-dam de-siltation, soil conservation, and drought-resistant crops.',
      },
      recommendedIndustry: {
        name: 'Jharkhand CleanTech Innovations MSME',
        mission: 'Agri-Tech & Solar Lift Irrigation Support',
        matchScore: 88,
        pledgeTypes: ['Solar Water Pumps', 'Soil Testing Kits', 'Organic Bio-degraders'],
      },
      requiredExpertise: ['Agronomy', 'Soil Mechanics', 'Solar Lift Irrigation', 'Sediment Traps'],
      aiConfidence: 91,
    };
  }

  // 3. Energy / Solar / Electricity
  if (
    text.includes('solar') ||
    text.includes('light') ||
    text.includes('electricity') ||
    text.includes('battery') ||
    text.includes('power') ||
    text.includes('inverter') ||
    text.includes('grid')
  ) {
    return {
      detectedDomain: 'Renewable Energy & Decentralized Power',
      subdomain: 'Solar Micro-Grid & Energy Storage Maintenance',
      severity: 'Medium Severity',
      severityScore: 74,
      sdgs: [
        { code: 'SDG 7', name: 'Affordable & Clean Energy' },
        { code: 'SDG 11', name: 'Sustainable Cities & Communities' },
      ],
      recommendedUniversity: {
        name: 'Birla Institute of Technology (BIT Mesra)',
        department: 'Dept of Electrical & Renewable Energy Systems',
        matchScore: 92,
        rationale: 'Specialized lab for solar PV fault diagnostic and rural battery storage design.',
      },
      recommendedIndustry: {
        name: 'Jharkhand CleanTech Innovations MSME',
        mission: 'Rural Electrification & Off-Grid Solar Deployment',
        matchScore: 89,
        pledgeTypes: ['Replacement Lithium Inverters', 'Smart BMS Hardware', 'Technical Technician Training'],
      },
      requiredExpertise: ['Power Electronics', 'Battery Energy Storage Systems', 'Solar PV', 'IoT Smart Metering'],
      aiConfidence: 89,
    };
  }

  // 4. Urban Infrastructure / Roads / Bridges
  if (
    text.includes('road') ||
    text.includes('bridge') ||
    text.includes('culvert') ||
    text.includes('pothole') ||
    text.includes('traffic') ||
    text.includes('drain')
  ) {
    return {
      detectedDomain: 'Civic Infrastructure & Rural Connectivity',
      subdomain: 'Bridge Culvert & Road Resiliency Engineering',
      severity: 'High Severity',
      severityScore: 86,
      sdgs: [
        { code: 'SDG 9', name: 'Industry, Innovation & Infrastructure' },
        { code: 'SDG 11', name: 'Sustainable Cities & Communities' },
      ],
      recommendedUniversity: {
        name: 'IIT (ISM) Dhanbad',
        department: 'Dept of Civil Engineering',
        matchScore: 93,
        rationale: 'Expertise in modular pre-cast culvert bridges and flood-resistant rural pavement.',
      },
      recommendedIndustry: {
        name: 'Tata Steel Infrastructure CSR',
        mission: 'Rural Access Roads & Connectivity Initiative',
        matchScore: 90,
        pledgeTypes: ['Slag-Based Road Paving Material', 'Pre-cast Concrete Pipe Donations', 'Civil Engineering Mentorship'],
      },
      requiredExpertise: ['Structural Engineering', 'Hydraulic Flow Analysis', 'Pre-cast Concrete', 'Rapid Deployment Bridges'],
      aiConfidence: 92,
    };
  }

  // 5. Default Fallback
  return {
    detectedDomain: category || 'Societal Infrastructure Challenge',
    subdomain: 'Community Level Need',
    severity: 'Medium Severity',
    severityScore: 70,
    sdgs: [
      { code: 'SDG 11', name: 'Sustainable Cities & Communities' },
      { code: 'SDG 9', name: 'Industry, Innovation & Infrastructure' },
    ],
    recommendedUniversity: {
      name: 'Birla Institute of Technology (BIT Mesra)',
      department: 'Interdisciplinary Innovation & Incubation Center',
      matchScore: 85,
      rationale: 'Multi-disciplinary student project incubation hub.',
    },
    recommendedIndustry: {
      name: 'Tata Steel CSR Foundation',
      mission: 'Community Welfare & Societal Impact Fund',
      matchScore: 84,
      pledgeTypes: ['Project Grant Seed Capital', 'Student Project Mentorship'],
    },
    requiredExpertise: ['Applied Engineering', 'Field Assessment', 'Rapid Prototyping'],
    aiConfidence: 82,
  };
};

/**
 * AI Problem Decomposition Engine
 * Breaks down complex ground challenges into:
 * 1. HEI_RESEARCH: Assigned to specialized University / Academic Department (e.g. BAU, BIT Mesra, IIT ISM)
 * 2. SOFTWARE_TECH: Assigned to Software / IoT telemetry engineering lab
 * 3. GOVERNMENT_INFRASTRUCTURE: Assigned to PRI / ULB / District Admin for civil works & procurement
 */
const generateDecomposedSubProblems = ({ title = '', description = '', category = '', district = 'Ranchi' }) => {
  const text = `${title} ${description} ${category}`.toLowerCase();

  // 1. Water Quality / Contamination
  if (
    text.includes('water') ||
    text.includes('fluoride') ||
    text.includes('rust') ||
    text.includes('arsenic') ||
    text.includes('borewell') ||
    text.includes('drinking')
  ) {
    return [
      {
        subProblemId: 'SP-HEI-01',
        title: 'Decentralized Chemical Adsorption & Fluoride/Heavy Metal Filtration Unit',
        track: 'HEI_RESEARCH',
        assignedRole: 'participating_hei',
        targetHEI: 'Birsa Agricultural University (BAU) / BIT Mesra',
        targetDepartment: 'Dept of Hydrology & Chemical Engineering',
        scopeDescription:
          'Synthesize low-cost activated alumina and charcoal adsorption columns capable of off-grid filtration (4,000 L/day) reducing fluoride to < 0.5 PPM per BIS 10500 standards.',
        deliverable: 'TRL-3 Working Filter Core Prototype + Chemical Efficacy Audit Report',
        requiredSkills: ['Water Chemistry', 'Adsorption Kinetics', 'Filter Column Design'],
        estimatedTimeframe: '8-10 Weeks',
        status: 'PROPOSED',
        assignedTo: {
          userName: 'Dr. A.K. Singh',
          userEmail: 'nodal.water@bau.edu.in',
          organizationName: 'Birsa Agricultural University (BAU)',
          assignedAt: new Date(),
          isSelfAssigned: false,
          modifiedNotes: 'AI Recommended based on active BAU Water Quality Lab capability',
        },
      },
      {
        subProblemId: 'SP-TECH-02',
        title: 'Solar IoT Telemetry Node & Real-Time Water Quality Monitoring Dashboard',
        track: 'SOFTWARE_TECH',
        assignedRole: 'participating_hei',
        targetHEI: 'IIT (ISM) Dhanbad / BIT Mesra',
        targetDepartment: 'Dept of Electronics & Computer Science',
        scopeDescription:
          'Design an off-grid solar-powered telemetry box with inline TDS, pH, and Turbidity optical probes, pushing 15-minute readings to the State Public Transparency Board with automated SMS alerts.',
        deliverable: 'Enclosed ESP32/LoRa Hardware Node + Cloud Telemetry Stream API',
        requiredSkills: ['IoT Firmware', 'Embedded C', 'LoRaWAN Telemetry', 'Cloud APIs'],
        estimatedTimeframe: '6-8 Weeks',
        status: 'PROPOSED',
        assignedTo: {
          userName: 'Prof. Rajiv Ranjan',
          userEmail: 'faculty.bit@bitmesra.ac.in',
          organizationName: 'BIT Mesra',
          assignedAt: new Date(),
          isSelfAssigned: false,
          modifiedNotes: 'AI Recommended based on BIT Mesra IoT & Embedded Systems Lab',
        },
      },
      {
        subProblemId: 'SP-GOVT-03',
        title: 'Supply Line Pressure Testing, Well Sanitization & Community Storage Cistern',
        track: 'GOVERNMENT_INFRASTRUCTURE',
        assignedRole: 'government',
        targetHEI: `${district || 'Gumla'} District Water & Sanitation Mission`,
        targetDepartment: 'Panchayati Raj Civil Engineering Wing',
        scopeDescription:
          'Perform physical on-site pressure inspection of all community borewells, replace corroded riser pipelines, construct a reinforced concrete foundation, and install a 5,000L food-grade storage reservoir.',
        deliverable: 'Site Civil Readiness Clearance + Completed Physical Pipeline Overhaul',
        requiredSkills: ['Civil Piping Inspection', 'Tender Procurement', 'Panchayat Verification'],
        estimatedTimeframe: '4-6 Weeks',
        status: 'PROPOSED',
        assignedTo: {
          userName: 'Sanjay Oraon (Mukhiya)',
          userEmail: 'pri.kamdara@jharkhand.gov.in',
          organizationName: 'Kamdara Gram Panchayat',
          assignedAt: new Date(),
          isSelfAssigned: false,
          modifiedNotes: 'AI Assigned to Local PRI for ground execution',
        },
      },
    ];
  }

  // 2. Agriculture / Irrigation / Soil
  if (
    text.includes('soil') ||
    text.includes('crop') ||
    text.includes('irrigation') ||
    text.includes('canal') ||
    text.includes('farmer') ||
    text.includes('drought')
  ) {
    return [
      {
        subProblemId: 'SP-HEI-01',
        title: 'Micro-Sediment Trap & Bio-Enzymatic De-Siltation for Check-Dams',
        track: 'HEI_RESEARCH',
        assignedRole: 'participating_hei',
        targetHEI: 'Birsa Agricultural University (BAU)',
        targetDepartment: 'Faculty of Agricultural Engineering & Agronomy',
        scopeDescription:
          'Design biological silt catchment barriers and field-test bio-enzymes to digest organic sedimentation without eroding earthen canal banks.',
        deliverable: 'Tested Silt Trap Blueprints + Field Efficacy Validation Report',
        requiredSkills: ['Agronomy', 'Soil Mechanics', 'Sediment Traps'],
        estimatedTimeframe: '8-10 Weeks',
        status: 'PROPOSED',
        assignedTo: {
          userName: 'Dr. A.K. Singh',
          userEmail: 'nodal.water@bau.edu.in',
          organizationName: 'Birsa Agricultural University (BAU)',
          assignedAt: new Date(),
          isSelfAssigned: false,
          modifiedNotes: 'AI Recommended based on BAU Agronomy research',
        },
      },
      {
        subProblemId: 'SP-TECH-02',
        title: 'Drone & Satellite NDVI Soil Moisture Mapping & Farmer Advisory Portal',
        track: 'SOFTWARE_TECH',
        assignedRole: 'participating_hei',
        targetHEI: 'IIT (ISM) Dhanbad',
        targetDepartment: 'Dept of Environmental Engineering & Geoinformatics',
        scopeDescription:
          'Develop automated GIS satellite processing to track weekly soil moisture levels across rainfed farm plots and push vernacular SMS advisory to farmers.',
        deliverable: 'GIS Soil Moisture Dashboard + Automated Twilio/SMS Dispatcher',
        requiredSkills: ['GIS Analysis', 'Satellite NDVI', 'Python Geospatial', 'Web Portals'],
        estimatedTimeframe: '6-8 Weeks',
        status: 'PROPOSED',
        assignedTo: {
          userName: 'Ananya Mukherjee',
          userEmail: 'innovator@iitdhanbad.ac.in',
          organizationName: 'IIT ISM Dhanbad',
          assignedAt: new Date(),
          isSelfAssigned: false,
          modifiedNotes: 'AI Recommended for Geoinformatics team',
        },
      },
      {
        subProblemId: 'SP-GOVT-03',
        title: 'Canal Desiltation Work Order & Sluice Gate Mechanical Replacement',
        track: 'GOVERNMENT_INFRASTRUCTURE',
        assignedRole: 'government',
        targetHEI: `${district || 'District'} Irrigation Division`,
        targetDepartment: 'District Minor Irrigation Office',
        scopeDescription:
          'Execute administrative tendering for mechanical earth excavation along 3.5 km irrigation canal branch, replace rusty sluice gates, and establish village water user committee.',
        deliverable: 'Excavation Completion Certificate + Functional Sluice Gates',
        requiredSkills: ['Canal Hydraulics', 'Civil Contracting', 'Community Water Associations'],
        estimatedTimeframe: '4-6 Weeks',
        status: 'PROPOSED',
        assignedTo: {
          userName: 'District Collector Office',
          userEmail: 'admin@jharkhand.gov.in',
          organizationName: `${district || 'District'} Administration`,
          assignedAt: new Date(),
          isSelfAssigned: false,
          modifiedNotes: 'AI Assigned to District Irrigation Division',
        },
      },
    ];
  }

  // 3. Renewable Energy / Solar / Power
  if (
    text.includes('solar') ||
    text.includes('electricity') ||
    text.includes('power') ||
    text.includes('battery') ||
    text.includes('grid')
  ) {
    return [
      {
        subProblemId: 'SP-HEI-01',
        title: 'High-Efficiency MPPT Solar Inverter & Solid-State Battery Storage Unit',
        track: 'HEI_RESEARCH',
        assignedRole: 'participating_hei',
        targetHEI: 'National Institute of Technology (NIT) Jamshedpur',
        targetDepartment: 'Dept of Electrical & Electronics Engineering',
        scopeDescription:
          'Build a robust, surge-protected 5kW decentralized solar hybrid inverter optimized for rural intermittent voltage fluctuations with thermal heat dissipation.',
        deliverable: 'Working 5kW MPPT Inverter Hardware Prototype + Efficiency Benchmarks',
        requiredSkills: ['Power Electronics', 'MPPT Controllers', 'Battery Thermal Management'],
        estimatedTimeframe: '8-10 Weeks',
        status: 'PROPOSED',
        assignedTo: {
          userName: 'Prof. Rajiv Ranjan',
          userEmail: 'faculty.bit@bitmesra.ac.in',
          organizationName: 'BIT Mesra / NIT Jamshedpur',
          assignedAt: new Date(),
          isSelfAssigned: false,
          modifiedNotes: 'AI Recommended for Electrical Engineering Lab',
        },
      },
      {
        subProblemId: 'SP-TECH-02',
        title: 'Micro-Grid Automated Load Shedding & Tamper Detection Telemetry',
        track: 'SOFTWARE_TECH',
        assignedRole: 'participating_hei',
        targetHEI: 'BIT Mesra, Ranchi',
        targetDepartment: 'Dept of Computer Science & Automation',
        scopeDescription:
          'Implement edge microcontroller code to monitor phase load imbalances, detect power theft/line tampering, and dynamically balance battery discharge cycles.',
        deliverable: 'Edge Firmware + Cloud Energy Metrics Dashboard',
        requiredSkills: ['Smart Metering', 'Edge Computing', 'Time-Series DB'],
        estimatedTimeframe: '6-8 Weeks',
        status: 'PROPOSED',
        assignedTo: {
          userName: 'Ananya Mukherjee',
          userEmail: 'innovator@iitdhanbad.ac.in',
          organizationName: 'IIT ISM Dhanbad',
          assignedAt: new Date(),
          isSelfAssigned: false,
          modifiedNotes: 'AI Recommended for Embedded Systems team',
        },
      },
      {
        subProblemId: 'SP-GOVT-03',
        title: 'Poles Structural Foundation, Wiring Rigging & JREDA Subsidy Sanction',
        track: 'GOVERNMENT_INFRASTRUCTURE',
        assignedRole: 'government',
        targetHEI: 'Jharkhand Renewable Energy Development Agency (JREDA)',
        targetDepartment: 'District Energy Supply Cell',
        scopeDescription:
          'Erect wind-resistant galvanized solar mounting poles, lay underground armored cabling to 80 households, and sanction state renewable subsidies.',
        deliverable: 'Grid Connection Clearance + JREDA Subsidy Sanction Order',
        requiredSkills: ['Electrical Line Layout', 'Safety Certification', 'Govt Energy Schemes'],
        estimatedTimeframe: '4-6 Weeks',
        status: 'PROPOSED',
        assignedTo: {
          userName: 'Dr. Sunita Murmu',
          userEmail: 'admin@jharkhand.gov.in',
          organizationName: 'State Innovation Council',
          assignedAt: new Date(),
          isSelfAssigned: false,
          modifiedNotes: 'AI Assigned to State Energy Agency',
        },
      },
    ];
  }

  // 4. Default Fallback Decomposition for any other domain
  return [
    {
      subProblemId: 'SP-HEI-01',
      title: `Applied Engineering & Prototyping Module: ${title.slice(0, 45)}`,
      track: 'HEI_RESEARCH',
      assignedRole: 'participating_hei',
      targetHEI: 'Birla Institute of Technology (BIT Mesra)',
      targetDepartment: 'Department of Applied Engineering & Innovation',
      scopeDescription: `Analyze root mechanical/scientific causes of ${title.toLowerCase()} and fabricate a low-cost, resilient prototype solving the localized challenge in ${district}.`,
      deliverable: 'TRL 1–3 Validated Functional Prototype + Engineering Dossier',
      requiredSkills: ['Applied Engineering', 'Rapid Prototyping', 'Field Testing'],
      estimatedTimeframe: '8-12 Weeks',
      status: 'PROPOSED',
      assignedTo: {
        userName: 'Prof. Rajiv Ranjan',
        userEmail: 'faculty.bit@bitmesra.ac.in',
        organizationName: 'BIT Mesra, Ranchi',
        assignedAt: new Date(),
        isSelfAssigned: false,
        modifiedNotes: 'AI Recommended for Academic Innovation Cell',
      },
    },
    {
      subProblemId: 'SP-TECH-02',
      title: `Digital Monitoring, Telemetry & Citizen Feedback App`,
      track: 'SOFTWARE_TECH',
      assignedRole: 'participating_hei',
      targetHEI: 'IIT (ISM) Dhanbad',
      targetDepartment: 'Computer Science & Engineering Lab',
      scopeDescription: `Build a real-time tracking interface and mobile grievance feedback component to give citizens transparent status updates on the intervention.`,
      deliverable: 'Functional Web/Mobile Telemetry Service + API Integration',
      requiredSkills: ['Web Architecture', 'REST APIs', 'Mobile Responsive UI'],
      estimatedTimeframe: '6-8 Weeks',
      status: 'PROPOSED',
      assignedTo: {
        userName: 'Ananya Mukherjee',
        userEmail: 'innovator@iitdhanbad.ac.in',
        organizationName: 'IIT ISM Dhanbad',
        assignedAt: new Date(),
        isSelfAssigned: false,
        modifiedNotes: 'AI Recommended for Software Development Cell',
      },
    },
    {
      subProblemId: 'SP-GOVT-03',
      title: `Administrative Ground Truth Survey, Materials Procurement & Policy Sanction`,
      track: 'GOVERNMENT_INFRASTRUCTURE',
      assignedRole: 'government',
      targetHEI: `${district || 'District'} Administration & Local PRI`,
      targetDepartment: 'District Collector Planning Division',
      scopeDescription: `Conduct ground verification with local Mukhiya, approve field budget expenditure, clear regulatory permits, and oversee public deployment.`,
      deliverable: 'Administrative Work Sanction Order + Field Inspection Certificate',
      requiredSkills: ['Civil Inspection', 'Budget Allocation', 'Inter-Agency Coordination'],
      estimatedTimeframe: '4-6 Weeks',
      status: 'PROPOSED',
      assignedTo: {
        userName: 'Pooja Singhal, IAS',
        userEmail: 'dc.gumla@jharkhand.gov.in',
        organizationName: `${district || 'District'} Administration`,
        assignedAt: new Date(),
        isSelfAssigned: false,
        modifiedNotes: 'AI Assigned to District Administrative Division',
      },
    },
  ];
};

/**
 * Main Triage Function
 * 1. Tries to call FastAPI microservice (FASTAPI_AI_URL, e.g. http://localhost:8000/api/triage or /triage)
 * 2. If FastAPI is not responding, seamlessly falls back to semantic rule engine.
 */
const analyzeProblem = async ({ title, description, category, district }) => {
  const fastApiUrl = process.env.FASTAPI_AI_URL || 'http://localhost:8000';
  const endpoint = `${fastApiUrl.replace(/\/+$/, '')}/api/triage`;
  const subProblems = generateDecomposedSubProblems({ title, description, category, district });

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 2500); // 2.5s timeout

    const response = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, description, category, district }),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (response.ok) {
      const data = await response.json();
      console.log('[AI Triage] Successfully received prediction from FastAPI microservice');
      return {
        source: 'fastapi_microservice',
        data: {
          ...data,
          decomposedSubProblems: data.decomposedSubProblems || subProblems,
        },
      };
    } else {
      console.warn(`[AI Triage] FastAPI returned HTTP ${response.status}. Using fallback triage engine.`);
    }
  } catch (error) {
    // Expected when friend's microservice is not yet running
    console.log(`[AI Triage] FastAPI microservice not reached (${error.message}). Using built-in semantic triage engine.`);
  }

  // Fallback engine
  const fallbackResult = fallbackTriageEngine(title, description, category, district);
  fallbackResult.decomposedSubProblems = subProblems;
  return {
    source: 'built_in_triage_engine',
    data: fallbackResult,
  };
};

module.exports = {
  analyzeProblem,
  fallbackTriageEngine,
  generateDecomposedSubProblems,
};
