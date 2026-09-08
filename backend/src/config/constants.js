export const ORG_TYPES = {
  CITIZEN_COMMUNITY: 'citizen_community',
  PRI_LOCAL_BODY: 'pri_local_body',
  NODAL_HEI: 'nodal_hei',
  PARTICIPATING_HEI: 'participating_hei',
  INDUSTRY_STARTUP: 'industry_startup',
  STATE_GOVT: 'state_govt'
};

export const USER_ROLES = {
  CITIZEN: 'citizen',
  PRI_OFFICER: 'pri_officer',
  NODAL_DIRECTOR: 'nodal_director',
  FACULTY: 'faculty',
  STUDENT: 'student',
  INDUSTRY_EXPERT: 'industry_expert',
  STATE_ADMIN: 'state_admin'
};

export const CONTEXTUAL_PROJECT_ROLES = {
  EVALUATION_COMMITTEE_MEMBER: 'evaluation_committee_member',
  PROJECT_PI: 'project_pi',
  STUDENT_LEAD: 'student_lead',
  TECHNICAL_MENTOR: 'technical_mentor',
  PILOT_COORDINATOR: 'pilot_coordinator'
};

export const PROBLEM_STATES = {
  SUBMITTED: 'SUBMITTED',
  AI_CLASSIFIED: 'AI_CLASSIFIED',
  PRI_VERIFICATION_PENDING: 'PRI_VERIFICATION_PENDING',
  PRI_VERIFIED: 'PRI_VERIFIED',
  REJECTED: 'REJECTED',
  NODAL_ASSIGNED: 'NODAL_ASSIGNED',
  MASTER_PROBLEM_CREATED: 'MASTER_PROBLEM_CREATED',
  DECOMPOSED: 'DECOMPOSED',
  CFP_PUBLISHED: 'CFP_PUBLISHED',
  PROPOSALS_RECEIVED: 'PROPOSALS_RECEIVED',
  COMMITTEE_SCORING: 'COMMITTEE_SCORING',
  EVALUATION_RECOMMENDED: 'EVALUATION_RECOMMENDED',
  SYNTHESIZED_APPROVED: 'SYNTHESIZED_APPROVED',
  PROJECT_ACTIVE: 'PROJECT_ACTIVE',
  LAB_VALIDATED: 'LAB_VALIDATED',
  FIELD_PILOT_DEPLOYED: 'FIELD_PILOT_DEPLOYED',
  PRI_GROUND_VERIFIED: 'PRI_GROUND_VERIFIED',
  TECHNICAL_VERIFIED: 'TECHNICAL_VERIFIED',
  STATE_ACCEPTED: 'STATE_ACCEPTED',
  RESOLVED_CLOSED: 'RESOLVED_CLOSED'
};

export const SEVERITY_LEVELS = {
  LOW: 'LOW',
  MEDIUM: 'MEDIUM',
  HIGH: 'HIGH',
  CRITICAL: 'CRITICAL'
};

export const URGENCY_LEVELS = {
  LOW: 'LOW',
  MEDIUM: 'MEDIUM',
  HIGH: 'HIGH',
  EMERGENCY: 'EMERGENCY'
};

export const METRIC_DIRECTIONS = {
  INCREASE: 'INCREASE',
  DECREASE: 'DECREASE',
  TARGET_RANGE: 'TARGET_RANGE'
};

export const IP_STATUSES = {
  NOT_APPLICABLE: 'NOT_APPLICABLE',
  UNDER_DISCUSSION: 'UNDER_DISCUSSION',
  MOU_EXECUTED: 'MOU_EXECUTED',
  PATENT_FILED: 'PATENT_FILED',
  PATENT_GRANTED: 'PATENT_GRANTED',
  TECH_TRANSFERRED: 'TECH_TRANSFERRED'
};

export const DOMAINS = {
  WATER_RESOURCES: {
    key: 'water_resources',
    displayName: 'Water Resources & Quality Management',
    nodalOrgName: 'Birsa Agricultural University (BAU) & BIT Mesra Joint Council'
  },
  AGRICULTURE: {
    key: 'agriculture',
    displayName: 'Smart Agriculture & Soil Health',
    nodalOrgName: 'Birsa Agricultural University (BAU) Ranchi'
  },
  HEALTHCARE: {
    key: 'healthcare',
    displayName: 'Rural Public Health & Sanitation',
    nodalOrgName: 'AIIMS Deoghar'
  },
  ENVIRONMENT_MINING: {
    key: 'environment_mining',
    displayName: 'Environment, Hydrology & Mining Reclamation',
    nodalOrgName: 'IIT (ISM) Dhanbad'
  },
  URBAN_IOT: {
    key: 'urban_iot',
    displayName: 'Urban Infrastructure, IoT & Energy',
    nodalOrgName: 'BIT Mesra Ranchi'
  },
  RURAL_LIVELIHOODS: {
    key: 'rural_livelihoods',
    displayName: 'Rural Livelihoods & Forest Produce',
    nodalOrgName: 'National Institute of Foundry & Forge Technology (NIFFT)'
  }
};

/**
 * State Transition Matrix:
 * CurrentState -> Allowed Target States with required roles and permissions
 */
export const STATE_TRANSITION_RULES = {
  [PROBLEM_STATES.SUBMITTED]: [
    {
      target: PROBLEM_STATES.AI_CLASSIFIED,
      allowedRoles: [USER_ROLES.STATE_ADMIN, 'system'],
      description: 'AI extracts domains, severity, and skill weights'
    }
  ],
  [PROBLEM_STATES.AI_CLASSIFIED]: [
    {
      target: PROBLEM_STATES.PRI_VERIFICATION_PENDING,
      allowedRoles: [USER_ROLES.STATE_ADMIN, 'system'],
      description: 'Routed to local Gram Panchayat / BDO'
    }
  ],
  [PROBLEM_STATES.PRI_VERIFICATION_PENDING]: [
    {
      target: PROBLEM_STATES.PRI_VERIFIED,
      allowedRoles: [USER_ROLES.PRI_OFFICER, USER_ROLES.STATE_ADMIN],
      description: 'PRI officer verifies on-ground authenticity and baseline'
    },
    {
      target: PROBLEM_STATES.REJECTED,
      allowedRoles: [USER_ROLES.PRI_OFFICER, USER_ROLES.STATE_ADMIN],
      description: 'PRI officer rejects with mandatory justification'
    }
  ],
  [PROBLEM_STATES.PRI_VERIFIED]: [
    {
      target: PROBLEM_STATES.NODAL_ASSIGNED,
      allowedRoles: [USER_ROLES.STATE_ADMIN, 'system'],
      description: 'Configurable domain mapping routes problem to Domain Lead HEI'
    }
  ],
  [PROBLEM_STATES.NODAL_ASSIGNED]: [
    {
      target: PROBLEM_STATES.DECOMPOSED,
      allowedRoles: [USER_ROLES.NODAL_DIRECTOR, USER_ROLES.STATE_ADMIN],
      description: 'Nodal Director decomposes into sub-problems with dependencies'
    }
  ],
  [PROBLEM_STATES.DECOMPOSED]: [
    {
      target: PROBLEM_STATES.CFP_PUBLISHED,
      allowedRoles: [USER_ROLES.NODAL_DIRECTOR, USER_ROLES.STATE_ADMIN],
      description: 'Call for Proposals published to matched HEIs & Startups'
    }
  ],
  [PROBLEM_STATES.CFP_PUBLISHED]: [
    {
      target: PROBLEM_STATES.PROPOSALS_RECEIVED,
      allowedRoles: [USER_ROLES.FACULTY, USER_ROLES.INDUSTRY_EXPERT, USER_ROLES.NODAL_DIRECTOR, USER_ROLES.STATE_ADMIN],
      description: 'Eligible institutions and startups submit bids'
    }
  ],
  [PROBLEM_STATES.PROPOSALS_RECEIVED]: [
    {
      target: PROBLEM_STATES.COMMITTEE_SCORING,
      allowedRoles: [USER_ROLES.NODAL_DIRECTOR, USER_ROLES.STATE_ADMIN],
      description: 'Evaluation committee constituted to score proposals'
    }
  ],
  [PROBLEM_STATES.COMMITTEE_SCORING]: [
    {
      target: PROBLEM_STATES.EVALUATION_RECOMMENDED,
      allowedRoles: [USER_ROLES.NODAL_DIRECTOR, USER_ROLES.FACULTY, USER_ROLES.INDUSTRY_EXPERT, USER_ROLES.STATE_ADMIN],
      description: 'Scores finalized on 7-parameter rubric'
    }
  ],
  [PROBLEM_STATES.EVALUATION_RECOMMENDED]: [
    {
      target: PROBLEM_STATES.SYNTHESIZED_APPROVED,
      allowedRoles: [USER_ROLES.NODAL_DIRECTOR, USER_ROLES.STATE_ADMIN],
      description: 'Nodal Director approves single winner or synthesizes hybrid team'
    }
  ],
  [PROBLEM_STATES.SYNTHESIZED_APPROVED]: [
    {
      target: PROBLEM_STATES.PROJECT_ACTIVE,
      allowedRoles: [USER_ROLES.NODAL_DIRECTOR, USER_ROLES.STATE_ADMIN],
      description: 'Project officially constituted and funded'
    }
  ],
  [PROBLEM_STATES.PROJECT_ACTIVE]: [
    {
      target: PROBLEM_STATES.LAB_VALIDATED,
      allowedRoles: [USER_ROLES.NODAL_DIRECTOR, USER_ROLES.FACULTY, USER_ROLES.STATE_ADMIN],
      description: 'Milestone proof verified in lab'
    }
  ],
  [PROBLEM_STATES.LAB_VALIDATED]: [
    {
      target: PROBLEM_STATES.FIELD_PILOT_DEPLOYED,
      allowedRoles: [USER_ROLES.NODAL_DIRECTOR, USER_ROLES.PRI_OFFICER, USER_ROLES.STATE_ADMIN],
      description: 'Hardware/solution deployed in target Panchayat'
    }
  ],
  [PROBLEM_STATES.FIELD_PILOT_DEPLOYED]: [
    {
      target: PROBLEM_STATES.PRI_GROUND_VERIFIED,
      allowedRoles: [USER_ROLES.PRI_OFFICER, USER_ROLES.STATE_ADMIN],
      description: 'PRI verifies on-ground community operational access'
    }
  ],
  [PROBLEM_STATES.PRI_GROUND_VERIFIED]: [
    {
      target: PROBLEM_STATES.TECHNICAL_VERIFIED,
      allowedRoles: [USER_ROLES.NODAL_DIRECTOR, USER_ROLES.STATE_ADMIN],
      description: 'Nodal experts audit lab assay and telemetry telemetry'
    }
  ],
  [PROBLEM_STATES.TECHNICAL_VERIFIED]: [
    {
      target: PROBLEM_STATES.STATE_ACCEPTED,
      allowedRoles: [USER_ROLES.STATE_ADMIN],
      description: 'State government accepts outcomes for scale-up'
    }
  ],
  [PROBLEM_STATES.STATE_ACCEPTED]: [
    {
      target: PROBLEM_STATES.RESOLVED_CLOSED,
      allowedRoles: [USER_ROLES.STATE_ADMIN],
      description: 'Documented in State Innovation Repository'
    }
  ]
};
