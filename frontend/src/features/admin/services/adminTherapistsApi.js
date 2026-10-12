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

export const adminTherapistsApi = {
  async getTherapists(params = {}) {
    const query = new URLSearchParams();
    if (params.page) query.append('page', params.page);
    if (params.limit) query.append('limit', params.limit);
    if (params.search && params.search.trim()) query.append('search', params.search.trim());
    if (params.specialization && params.specialization !== 'All Specializations') {
      query.append('specialization', params.specialization);
    }
    if (params.status && params.status !== 'ALL') query.append('status', params.status);
    if (params.sortBy) query.append('sortBy', params.sortBy);
    if (params.sortOrder) query.append('sortOrder', params.sortOrder);

    const response = await fetch(`${API_URL}/admin/therapists?${query.toString()}`, {
      headers: getAuthHeaders(),
    });
    const result = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(getErrorMessage(result, 'Failed to fetch therapists'));
    return result;
  },

  async getSpecializations() {
    const response = await fetch(`${API_URL}/admin/therapists/specializations`, {
      headers: getAuthHeaders(),
    });
    const result = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(getErrorMessage(result, 'Failed to load specializations'));
    return result;
  },

  async getTherapist(id) {
    const response = await fetch(`${API_URL}/admin/therapists/${id}`, {
      headers: getAuthHeaders(),
    });
    const result = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(getErrorMessage(result, 'Failed to fetch therapist details'));
    return result;
  },

  async createTherapist(data) {
    const response = await fetch(`${API_URL}/admin/therapists`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    const result = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(getErrorMessage(result, 'Failed to create therapist'));
    return result;
  },

  async updateTherapist(id, data) {
    const response = await fetch(`${API_URL}/admin/therapists/${id}`, {
      method: 'PATCH',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    const result = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(getErrorMessage(result, 'Failed to update therapist profile'));
    return result;
  },

  async deleteTherapist(id) {
    const response = await fetch(`${API_URL}/admin/therapists/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
    const result = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(getErrorMessage(result, 'Failed to delete therapist'));
    return result;
  },

  async exportCsv(params = {}) {
    const query = new URLSearchParams();
    if (params.search && params.search.trim()) query.append('search', params.search.trim());
    if (params.specialization && params.specialization !== 'All Specializations') {
      query.append('specialization', params.specialization);
    }
    if (params.status && params.status !== 'ALL') query.append('status', params.status);
    if (params.sortBy) query.append('sortBy', params.sortBy);
    if (params.sortOrder) query.append('sortOrder', params.sortOrder);

    const token = localStorage.getItem('accessToken');
    const response = await fetch(`${API_URL}/admin/therapists/export?${query.toString()}`, {
      headers: {
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    });

    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      throw new Error(getErrorMessage(err, 'Failed to export CSV'));
    }

    const blob = await response.blob();
    const downloadUrl = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = downloadUrl;
    link.download = `wings-therapists-${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(downloadUrl);
  },
};
