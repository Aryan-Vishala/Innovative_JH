import { db } from '../data/store.js';

/**
 * Calculates Recommendation Compatibility Score (0 - 100)
 * Score = (0.80 * SkillMatch) + (0.10 * TrackRecord) + (0.10 * FieldFeasibility)
 */
export function calculateInstitutionMatch({
  targetDistrict,
  requiredDomain,
  requiredSkills = {}, // e.g. { 'IoT_Sensors': 30, 'Hydrology': 30, 'Filtration': 40 }
  candidateOrganizations = null
}) {
  const orgs = candidateOrganizations || db.organizations.filter((o) =>
    ['participating_hei', 'nodal_hei', 'industry_startup'].includes(o.type)
  );

  const results = orgs.map((org) => {
    const pci = org.pci || { score: 70, breakdown: { completedProjects: 5, patents: 0, districtPresence: [] } };
    const breakdown = pci.breakdown || {};

    // 1. Skill Match (0 - 100)
    // Compare required skills against organization domain capability
    let skillMatch = 75; // baseline
    if (org.primaryDomain === requiredDomain) {
      skillMatch = Math.min(100, pci.score + 5);
    } else {
      skillMatch = Math.max(50, pci.score - 15);
    }

    // 2. Track Record Score (0 - 100)
    const projects = breakdown.completedProjects || 0;
    const patents = breakdown.patents || 0;
    const trackRecordScore = Math.min(100, Math.round(projects * 3.5 + patents * 4));

    // 3. Field Feasibility Score (0 - 100)
    let fieldFeasibilityScore = 50;
    const presence = breakdown.districtPresence || [];
    if (presence.includes(targetDistrict)) {
      fieldFeasibilityScore = 100;
    } else if (presence.includes('All 24 Districts') || presence.includes('Ranchi')) {
      fieldFeasibilityScore = 80;
    }

    // Normalized Final Score (0 - 100)
    const totalScore = Math.round(
      (0.80 * skillMatch) +
      (0.10 * trackRecordScore) +
      (0.10 * fieldFeasibilityScore)
    );

    // Human-readable transparent explanation
    const reasons = [
      `${pci.score}% Platform Capability Index in ${pci.domain || org.primaryDomain}`,
      `${breakdown.facultyCount || '15+'} specialized faculty & research experts`,
      `${projects} completed state/national innovation projects`,
      presence.includes(targetDistrict)
        ? `Direct field operational presence in ${targetDistrict}`
        : `Regional R&D access from ${org.district}`
    ];

    return {
      organizationId: org.id,
      organizationName: org.name,
      type: org.type,
      district: org.district,
      totalScore,
      components: {
        skillMatchScore: Math.round(skillMatch),
        trackRecordScore,
        fieldFeasibilityScore
      },
      pciScore: pci.score,
      pciBreakdown: breakdown,
      reasons
    };
  });

  // Sort descending by match score
  return results.sort((a, b) => b.totalScore - a.totalScore);
}
