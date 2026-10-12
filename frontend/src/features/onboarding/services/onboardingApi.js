const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api/v1';

const getAuthHeaders = () => {
  const token = localStorage.getItem('accessToken');
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};

export const onboardingApi = {
  async getStatus() {
    const response = await fetch(`${API_URL}/onboarding/status`, {
      headers: getAuthHeaders(),
    });
    const result = await response.json();
    if (!response.ok) throw new Error(result.message || 'Failed to fetch onboarding status');
    return result;
  },

  async saveProgress(data) {
    const response = await fetch(`${API_URL}/onboarding/progress`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    const result = await response.json();
    if (!response.ok) throw new Error(result.message || 'Failed to save onboarding progress');
    return result;
  },

  async complete(data) {
    const response = await fetch(`${API_URL}/onboarding/complete`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    const result = await response.json();
    if (!response.ok) throw new Error(result.message || 'Failed to complete onboarding');
    return result;
  },
};

export const childrenApi = {
  async getMyChildren() {
    const response = await fetch(`${API_URL}/children`, {
      headers: getAuthHeaders(),
    });
    const result = await response.json();
    if (!response.ok) throw new Error(result.message || 'Failed to fetch children');
    return result;
  },

  async getChild(childId) {
    const response = await fetch(`${API_URL}/children/${childId}`, {
      headers: getAuthHeaders(),
    });
    const result = await response.json();
    if (!response.ok) throw new Error(result.message || 'Failed to fetch child details');
    return result;
  },

  async createChild(data) {
    const response = await fetch(`${API_URL}/children`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    const result = await response.json();
    if (!response.ok) throw new Error(result.message || 'Failed to create child profile');
    return result;
  },

  async updateChild(childId, data) {
    const response = await fetch(`${API_URL}/children/${childId}`, {
      method: 'PATCH',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    const result = await response.json();
    if (!response.ok) throw new Error(result.message || 'Failed to update child profile');
    return result;
  },
};

export const assessmentApi = {
  async savePreliminary(data) {
    const response = await fetch(`${API_URL}/assessment/preliminary`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    const result = await response.json();
    if (!response.ok) throw new Error(result.message || 'Failed to save assessment');
    return result;
  },

  async getPreliminary(childId) {
    const response = await fetch(`${API_URL}/assessment/preliminary/${childId}`, {
      headers: getAuthHeaders(),
    });
    const result = await response.json();
    if (!response.ok) throw new Error(result.message || 'Failed to fetch assessment');
    return result;
  },
};
