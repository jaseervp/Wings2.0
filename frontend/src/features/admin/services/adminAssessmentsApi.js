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

export const adminAssessmentsApi = {
  async getAssessments(params = {}) {
    const query = new URLSearchParams();
    if (params.page) query.append('page', params.page);
    if (params.limit) query.append('limit', params.limit);
    if (params.search && params.search.trim()) query.append('search', params.search.trim());
    if (params.status && params.status !== 'ALL') query.append('status', params.status);
    if (params.flagged !== undefined && params.flagged !== null) {
      query.append('flagged', String(params.flagged));
    }
    if (params.dateFrom) query.append('dateFrom', params.dateFrom);
    if (params.dateTo) query.append('dateTo', params.dateTo);
    if (params.sortBy) query.append('sortBy', params.sortBy);
    if (params.sortOrder) query.append('sortOrder', params.sortOrder);

    const response = await fetch(`${API_URL}/admin/assessments?${query.toString()}`, {
      headers: getAuthHeaders(),
    });
    const result = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(getErrorMessage(result, 'Failed to fetch assessments'));
    return result;
  },

  async getAssessment(id) {
    const response = await fetch(`${API_URL}/admin/assessments/${id}`, {
      headers: getAuthHeaders(),
    });
    const result = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(getErrorMessage(result, 'Failed to fetch assessment details'));
    return result;
  },

  async reviewAssessment(id, data) {
    const response = await fetch(`${API_URL}/admin/assessments/${id}/review`, {
      method: 'PATCH',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    const result = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(getErrorMessage(result, 'Failed to update review status'));
    return result;
  },

  async flagAssessment(id, data) {
    const response = await fetch(`${API_URL}/admin/assessments/${id}/flag`, {
      method: 'PATCH',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    const result = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(getErrorMessage(result, 'Failed to toggle flag'));
    return result;
  },

  async exportAssessments(params = {}) {
    const query = new URLSearchParams();
    if (params.search && params.search.trim()) query.append('search', params.search.trim());
    if (params.status && params.status !== 'ALL') query.append('status', params.status);
    if (params.flagged !== undefined && params.flagged !== null) {
      query.append('flagged', String(params.flagged));
    }
    if (params.dateFrom) query.append('dateFrom', params.dateFrom);
    if (params.dateTo) query.append('dateTo', params.dateTo);

    const token = localStorage.getItem('accessToken');
    const response = await fetch(`${API_URL}/admin/assessments/export?${query.toString()}`, {
      headers: {
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    });

    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      throw new Error(getErrorMessage(err, 'Failed to export assessments'));
    }

    const blob = await response.blob();
    const downloadUrl = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = downloadUrl;
    link.download = `preliminary-assessments-${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(downloadUrl);
  },
};
