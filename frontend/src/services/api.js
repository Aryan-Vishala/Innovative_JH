const API_BASE_URL = 'http://localhost:5000/api/v1';

function getAuthHeaders() {
  const token = localStorage.getItem('token');
  const activeUserId = localStorage.getItem('activeUserId');
  const headers = { 'Content-Type': 'application/json' };

  if (token) headers['Authorization'] = `Bearer ${token}`;
  if (activeUserId) headers['x-user-id'] = activeUserId;

  return headers;
}

async function request(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint}`;
  const config = {
    ...options,
    headers: {
      ...getAuthHeaders(),
      ...options.headers
    }
  };

  try {
    const res = await fetch(url, config);
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.message || `API Error: ${res.status}`);
    }
    return data;
  } catch (err) {
    console.error(`Fetch error on ${endpoint}:`, err);
    throw err;
  }
}

export const api = {
  // Auth & Roles
  getUsers: () => request('/auth/users'),
  getOrganizations: () => request('/auth/organizations'),
  login: (credentials) => request('/auth/login', { method: 'POST', body: JSON.stringify(credentials) }),
  switchUser: (userId) => request('/auth/switch-user', { method: 'POST', body: JSON.stringify({ userId }) }),
  getMe: () => request('/auth/me'),
  resetDemo: () => request('/auth/reset-demo', { method: 'POST' }),

  // Problems
  getProblems: (params = '') => request(`/problems${params}`),
  getProblemById: (id) => request(`/problems/${id}`),
  submitProblem: (data) => request('/problems', { method: 'POST', body: JSON.stringify(data) }),
  priVerify: (id, data) => request(`/problems/${id}/pri-verify`, { method: 'PATCH', body: JSON.stringify(data) }),
  aiOverride: (id, data) => request(`/problems/${id}/ai-override`, { method: 'PATCH', body: JSON.stringify(data) }),

  // Nodal Orchestration
  decomposeProblem: (data) => request('/nodal/decompose', { method: 'POST', body: JSON.stringify(data) }),
  getSubProblemMatches: (subProblemId) => request(`/nodal/sub-problems/${subProblemId}/matches`),
  publishCfp: (data) => request('/nodal/cfp-publish', { method: 'POST', body: JSON.stringify(data) }),
  synthesizeSolution: (data) => request('/nodal/synthesize', { method: 'POST', body: JSON.stringify(data) }),

  // Proposals & Scoring
  getProposals: (subProblemId) => request(`/proposals/sub-problem/${subProblemId}`),
  submitProposal: (data) => request('/proposals', { method: 'POST', body: JSON.stringify(data) }),
  scoreProposal: (proposalId, data) => request(`/proposals/${proposalId}/score`, { method: 'POST', body: JSON.stringify(data) }),

  // Projects & Milestones
  getProjects: () => request('/projects'),
  getProjectById: (id) => request(`/projects/${id}`),
  submitMilestoneProof: (projectId, milestoneId, data) =>
    request(`/projects/${projectId}/milestones/${milestoneId}/submit`, { method: 'PATCH', body: JSON.stringify(data) }),
  verifyMilestone: (projectId, milestoneId, data) =>
    request(`/projects/${projectId}/milestones/${milestoneId}/verify`, { method: 'PATCH', body: JSON.stringify(data) }),

  // Pilots & 3-Stage Verification Pipeline
  getPilots: () => request('/pilots'),
  getPilotById: (id) => request(`/pilots/${id}`),
  deployPilot: (data) => request('/pilots/deploy', { method: 'POST', body: JSON.stringify(data) }),
  priGroundVerify: (pilotId, data) => request(`/pilots/${pilotId}/pri-ground-verify`, { method: 'PATCH', body: JSON.stringify(data) }),
  nodalTechnicalVerify: (pilotId, data) => request(`/pilots/${pilotId}/nodal-technical-verify`, { method: 'PATCH', body: JSON.stringify(data) }),
  stateProgramAccept: (pilotId, data) => request(`/pilots/${pilotId}/state-program-accept`, { method: 'PATCH', body: JSON.stringify(data) }),

  // Simulated IoT Telemetry
  getTelemetry: (deviceId) => request(`/telemetry/device/${deviceId}`),
  ingestTelemetry: (data) => request('/telemetry/ingest', { method: 'POST', body: JSON.stringify(data) }),
  simulateStream: () => request('/telemetry/simulate-stream', { method: 'POST' }),

  // Audit Logs
  getAuditLogs: (params = '') => request(`/audit/logs${params}`),

  // State Analytics
  getStateOverview: () => request('/analytics/state-overview')
};
