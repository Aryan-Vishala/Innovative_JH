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
 * Main Triage Function
 * 1. Tries to call FastAPI microservice (FASTAPI_AI_URL, e.g. http://localhost:8000/api/triage or /triage)
 * 2. If FastAPI is not responding, seamlessly falls back to semantic rule engine.
 */
const analyzeProblem = async ({ title, description, category, district }) => {
  const fastApiUrl = process.env.FASTAPI_AI_URL || 'http://localhost:8000';
  const endpoint = `${fastApiUrl.replace(/\/+$/, '')}/api/triage`;

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
        data,
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
  return {
    source: 'built_in_triage_engine',
    data: fallbackResult,
  };
};

module.exports = {
  analyzeProblem,
  fallbackTriageEngine,
};
