const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1';

// Token Management Helpers
export const getToken = () => localStorage.getItem('ij_token');
export const setToken = (token) => localStorage.setItem('ij_token', token);
export const removeToken = () => {
  localStorage.removeItem('ij_token');
  localStorage.removeItem('ij_user');
};

export const getCurrentUser = () => {
  const user = localStorage.getItem('ij_user');
  try {
    return user ? JSON.parse(user) : null;
  } catch {
    return null;
  }
};

export const setCurrentUser = (user) => {
  localStorage.setItem('ij_user', JSON.stringify(user));
};

// Generic Fetch Wrapper
const request = async (endpoint, options = {}) => {
  const token = getToken();
  const headers = { ...options.headers };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  // If body is NOT FormData, set application/json
  if (options.body && !(options.body instanceof FormData)) {
    headers['Content-Type'] = 'application/json';
    options.body = JSON.stringify(options.body);
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.message || `Request failed with status ${response.status}`);
  }

  return data;
};

// 1. Auth API
export const authApi = {
  login: async (credentials) => {
    const res = await request('/auth/login', {
      method: 'POST',
      body: credentials,
    });
    if (res.data?.token) {
      setToken(res.data.token);
      setCurrentUser(res.data.user);
    }
    return res.data;
  },

  register: async (userData) => {
    const res = await request('/auth/register', {
      method: 'POST',
      body: userData,
    });
    if (res.data?.token) {
      setToken(res.data.token);
      setCurrentUser(res.data.user);
    }
    return res.data;
  },

  getMe: async () => {
    const res = await request('/auth/me');
    if (res.data) {
      setCurrentUser(res.data);
    }
    return res.data;
  },

  logout: () => {
    removeToken();
  },
};

// 2. Problems API
export const problemApi = {
  getAll: async (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return request(`/problems${query ? `?${query}` : ''}`);
  },

  getMySubmissions: async () => {
    return request('/problems/my-submissions');
  },

  getById: async (id) => {
    return request(`/problems/${id}`);
  },

  getPublicAnalytics: async () => {
    return request('/problems/public-analytics');
  },

  submit: async (formData) => {
    return request('/problems', {
      method: 'POST',
      body: formData,
    });
  },

  getAiTriage: async (payload) => {
    return request('/problems/ai-triage', {
      method: 'POST',
      body: payload,
    });
  },

  upvote: async (id) => {
    return request(`/problems/${id}/upvote`, {
      method: 'POST',
    });
  },

  adopt: async (id, payload) => {
    return request(`/problems/${id}/adopt`, {
      method: 'POST',
      body: payload,
    });
  },

  pledge: async (id, payload) => {
    return request(`/problems/${id}/pledge`, {
      method: 'POST',
      body: payload,
    });
  },
};

// 3. PRI API
export const priApi = {
  getQueue: async () => {
    return request('/pri/queue');
  },

  getStats: async () => {
    return request('/pri/stats');
  },

  validate: async (id, payload) => {
    return request(`/problems/${id}/pri-validate`, {
      method: 'PATCH',
      body: payload,
    });
  },
};

// 4. Nodal HEI API
export const nodalApi = {
  getProblems: async (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return request(`/nodal/problems${query ? `?${query}` : ''}`);
  },

  getStats: async () => {
    return request('/nodal/stats');
  },

  review: async (id, payload) => {
    return request(`/problems/${id}/nodal-review`, {
      method: 'PATCH',
      body: payload,
    });
  },
};

export default {
  auth: authApi,
  problems: problemApi,
  pri: priApi,
  nodal: nodalApi,
};
