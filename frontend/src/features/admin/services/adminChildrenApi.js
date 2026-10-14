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

export const adminChildrenApi = {
  async getChildren(params = {}) {
    const query = new URLSearchParams();
    if (params.page) query.append('page', params.page);
    if (params.limit) query.append('limit', params.limit);
    if (params.search && params.search.trim()) query.append('search', params.search.trim());
    if (params.gender && params.gender !== 'All' && params.gender !== 'Gender: All') {
      query.append('gender', params.gender);
    }
    if (params.ageRange && params.ageRange !== 'All' && params.ageRange !== 'Age Range: All') {
      query.append('ageRange', params.ageRange);
    }
    if (params.iqBand && params.iqBand !== 'All' && params.iqBand !== 'IQ Band: All') {
      query.append('iqBand', params.iqBand);
    }
    if (params.sortBy) query.append('sortBy', params.sortBy);
    if (params.sortOrder) query.append('sortOrder', params.sortOrder);

    const response = await fetch(`${API_URL}/admin/children?${query.toString()}`, {
      headers: getAuthHeaders(),
    });
    const result = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(getErrorMessage(result, 'Failed to fetch children'));
    return result;
  },

  async getChild(id) {
    const response = await fetch(`${API_URL}/admin/children/${id}`, {
      headers: getAuthHeaders(),
    });
    const result = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(getErrorMessage(result, 'Failed to fetch child details'));
    return result;
  },

  async getParents(search = '') {
    const query = new URLSearchParams();
    if (search && search.trim()) query.append('search', search.trim());

    const response = await fetch(`${API_URL}/admin/children/parents?${query.toString()}`, {
      headers: getAuthHeaders(),
    });
    const result = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(getErrorMessage(result, 'Failed to fetch parents'));
    return result;
  },

  async createChild(data) {
    const response = await fetch(`${API_URL}/admin/children`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    const result = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(getErrorMessage(result, 'Failed to create child profile'));
    return result;
  },

  async updateChild(id, data) {
    const response = await fetch(`${API_URL}/admin/children/${id}`, {
      method: 'PATCH',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    const result = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(getErrorMessage(result, 'Failed to update child profile'));
    return result;
  },

  async deleteChild(id) {
    const response = await fetch(`${API_URL}/admin/children/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
    const result = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(getErrorMessage(result, 'Failed to delete child profile'));
    return result;
  },

  async exportCsv(params = {}) {
    const query = new URLSearchParams();
    if (params.search && params.search.trim()) query.append('search', params.search.trim());
    if (params.gender && params.gender !== 'All' && params.gender !== 'Gender: All') {
      query.append('gender', params.gender);
    }
    if (params.ageRange && params.ageRange !== 'All' && params.ageRange !== 'Age Range: All') {
      query.append('ageRange', params.ageRange);
    }
    if (params.iqBand && params.iqBand !== 'All' && params.iqBand !== 'IQ Band: All') {
      query.append('iqBand', params.iqBand);
    }

    const token = localStorage.getItem('accessToken');
    const response = await fetch(`${API_URL}/admin/children/export?${query.toString()}`, {
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
    link.download = `wings-children-${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(downloadUrl);
  },
};
