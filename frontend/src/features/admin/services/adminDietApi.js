const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api/v1';

const getAuthHeaders = () => {
  const token = localStorage.getItem('accessToken');
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};

const getErrorMessage = (result, defaultMsg = 'An error occurred') => {
  if (!result) return defaultMsg;
  if (Array.isArray(result.message)) {
    return result.message.join('. ');
  }
  return result.message || defaultMsg;
};

export const adminDietApi = {
  async getSummary() {
    const response = await fetch(`${API_URL}/admin/diet/summary`, {
      headers: getAuthHeaders(),
    });
    const result = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(getErrorMessage(result, 'Failed to fetch diet summary'));
    return result;
  },

  async getTemplates(params = {}) {
    const query = new URLSearchParams();
    if (params.search && params.search.trim()) query.append('search', params.search.trim());
    if (params.category && params.category !== 'ALL') query.append('category', params.category);
    if (params.status && params.status !== 'ALL') query.append('status', params.status);

    const response = await fetch(`${API_URL}/admin/diet/templates?${query.toString()}`, {
      headers: getAuthHeaders(),
    });
    const result = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(getErrorMessage(result, 'Failed to fetch diet templates'));
    return result;
  },

  async getTemplate(id) {
    const response = await fetch(`${API_URL}/admin/diet/templates/${id}`, {
      headers: getAuthHeaders(),
    });
    const result = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(getErrorMessage(result, 'Failed to fetch diet template'));
    return result;
  },

  async createTemplate(data) {
    const response = await fetch(`${API_URL}/admin/diet/templates`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    const result = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(getErrorMessage(result, 'Failed to create diet template'));
    return result;
  },

  async updateTemplate(id, data) {
    const response = await fetch(`${API_URL}/admin/diet/templates/${id}`, {
      method: 'PATCH',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    const result = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(getErrorMessage(result, 'Failed to update diet template'));
    return result;
  },

  async archiveTemplate(id) {
    const response = await fetch(`${API_URL}/admin/diet/templates/${id}/archive`, {
      method: 'POST',
      headers: getAuthHeaders(),
    });
    const result = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(getErrorMessage(result, 'Failed to archive diet template'));
    return result;
  },

  // Food Database
  async getFoods(params = {}) {
    const query = new URLSearchParams();
    if (params.search && params.search.trim()) query.append('search', params.search.trim());
    if (params.category && params.category !== 'ALL') query.append('category', params.category);

    const response = await fetch(`${API_URL}/admin/diet/foods?${query.toString()}`, {
      headers: getAuthHeaders(),
    });
    const result = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(getErrorMessage(result, 'Failed to fetch foods'));
    return result;
  },

  async createFood(data) {
    const response = await fetch(`${API_URL}/admin/diet/foods`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    const result = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(getErrorMessage(result, 'Failed to create food item'));
    return result;
  },

  async updateFood(id, data) {
    const response = await fetch(`${API_URL}/admin/diet/foods/${id}`, {
      method: 'PATCH',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    const result = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(getErrorMessage(result, 'Failed to update food item'));
    return result;
  },

  async deleteFood(id) {
    const response = await fetch(`${API_URL}/admin/diet/foods/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
    const result = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(getErrorMessage(result, 'Failed to delete food item'));
    return result;
  },

  // Assignments & Eligibility
  async getEligibleChildren(templateId, search = '') {
    const query = new URLSearchParams();
    if (search && search.trim()) query.append('search', search.trim());

    const response = await fetch(`${API_URL}/admin/diet/eligible-children/${templateId}?${query.toString()}`, {
      headers: getAuthHeaders(),
    });
    const result = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(getErrorMessage(result, 'Failed to fetch eligible children'));
    return result;
  },

  async manualAssign(data) {
    const response = await fetch(`${API_URL}/admin/diet/assignments/manual`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    const result = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(getErrorMessage(result, 'Failed to assign diet template'));
    return result;
  },

  async previewAutoAssign(templateId) {
    const response = await fetch(`${API_URL}/admin/diet/assignments/auto/preview/${templateId}`, {
      headers: getAuthHeaders(),
    });
    const result = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(getErrorMessage(result, 'Failed to preview auto assignment'));
    return result;
  },

  async confirmAutoAssign(data) {
    const response = await fetch(`${API_URL}/admin/diet/assignments/auto/confirm`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    const result = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(getErrorMessage(result, 'Failed to confirm auto assignment'));
    return result;
  },

  // Conflicts
  async getConflicts() {
    const response = await fetch(`${API_URL}/admin/diet/conflicts`, {
      headers: getAuthHeaders(),
    });
    const result = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(getErrorMessage(result, 'Failed to fetch allergy conflicts'));
    return result;
  },

  async resolveConflict(assignmentId, data) {
    const response = await fetch(`${API_URL}/admin/diet/conflicts/${assignmentId}/resolve`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    const result = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(getErrorMessage(result, 'Failed to resolve conflict'));
    return result;
  },
};
