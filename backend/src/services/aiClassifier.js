import { db } from '../data/store.js';

export function analyzeProblemText({ title, description, district = 'Gumla' }) {
  const content = `${title} ${description}`.toLowerCase();

  let predictedDomain = 'water_resources';
  let predictedSubdomain = 'Groundwater Depletion & Water Quality';
  let severityScore = 75;
  let requiredExpertise = { 'IoT_Sensors': 25, 'Hydrology_WaterResources': 35, 'Chemical_Filtration': 25, 'Cloud_MobileApp': 15 };
  const keywords = [];

  // Domain keyword analysis
  if (content.includes('fluoride') || content.includes('water') || content.includes('handpump') || content.includes('borewell') || content.includes('groundwater')) {
    predictedDomain = 'water_resources';
    predictedSubdomain = 'Groundwater Table & Chemical Contamination';
    keywords.push('groundwater', 'water table', 'borewells');
    if (content.includes('fluoride') || content.includes('fluorosis') || content.includes('arsenic')) {
      keywords.push('fluoride', 'chemical contamination', 'water testing');
      severityScore = 92;
      requiredExpertise = {
        'IoT_Sensors': 30,
        'Hydrology_WaterResources': 30,
        'Chemical_Filtration': 20,
        'Cloud_MobileApp': 20
      };
    }
  } else if (content.includes('crop') || content.includes('pest') || content.includes('soil') || content.includes('fertilizer') || content.includes('farmer')) {
    predictedDomain = 'agriculture';
    predictedSubdomain = 'Crop Health & Soil Nutrient Optimization';
    severityScore = 80;
    keywords.push('agriculture', 'soil nutrients', 'crops');
    requiredExpertise = {
      'Agronomy': 40,
      'Soil_Science': 30,
      'IoT_Sensors': 20,
      'AI_Prediction': 10
    };
  } else if (content.includes('disease') || content.includes('health') || content.includes('malaria') || content.includes('clinic')) {
    predictedDomain = 'healthcare';
    predictedSubdomain = 'Community Epidemiology & Diagnostics';
    severityScore = 85;
    keywords.push('public health', 'epidemiology', 'rural health');
    requiredExpertise = {
      'Community_Medicine': 45,
      'Diagnostics': 30,
      'Mobile_Telemedicine': 25
    };
  }

  // Look up Nodal Institution from domain mappings
  const mapping = db.domainMappings.find((m) => m.domainKey === predictedDomain && m.isActive);
  const suggestedNodalOrgId = mapping ? mapping.nodalOrganizationId : 'org-bau';

  return {
    predictedDomain,
    predictedSubdomain,
    confidenceScore: 93.5,
    extractedKeywords: keywords.length ? keywords : ['societal challenge', 'rural infrastructure'],
    requiredExpertise,
    severityScore,
    suggestedNodalOrgId,
    analysisTimestamp: new Date().toISOString()
  };
}
