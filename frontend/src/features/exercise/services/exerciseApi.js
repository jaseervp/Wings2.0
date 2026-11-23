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

export const exerciseApi = {
  async getTodayActivities(childId, date) {
    const query = new URLSearchParams();
    if (childId) query.append('childId', childId);
    if (date) query.append('date', date);

    const response = await fetch(`${API_URL}/exercise/today?${query.toString()}`, {
      headers: getAuthHeaders(),
    });
    const result = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(getErrorMessage(result, 'Failed to fetch today exercises'));
    return result;
  },

  async completeActivity(activityPlanId, data = {}) {
    const response = await fetch(`${API_URL}/exercise/activities/${activityPlanId}/complete`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    const result = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(getErrorMessage(result, 'Failed to update activity completion'));
    return result;
  },

  async getSkillFocus(childId) {
    const query = new URLSearchParams();
    if (childId) query.append('childId', childId);

    const response = await fetch(`${API_URL}/exercise/skills?${query.toString()}`, {
      headers: getAuthHeaders(),
    });
    const result = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(getErrorMessage(result, 'Failed to fetch skill metrics'));
    return result;
  },

  async getTherapistFeedback(childId) {
    const query = new URLSearchParams();
    if (childId) query.append('childId', childId);

    const response = await fetch(`${API_URL}/exercise/therapist-feedback?${query.toString()}`, {
      headers: getAuthHeaders(),
    });
    const result = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(getErrorMessage(result, 'Failed to fetch therapist feedback'));
    return result;
  },

  async getActivityCoach(childId) {
    const query = new URLSearchParams();
    if (childId) query.append('childId', childId);

    const response = await fetch(`${API_URL}/exercise/coach?${query.toString()}`, {
      headers: getAuthHeaders(),
    });
    const result = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(getErrorMessage(result, 'Failed to fetch coach advice'));
    return result;
  },

  async getMilestones(childId) {
    const query = new URLSearchParams();
    if (childId) query.append('childId', childId);

    const response = await fetch(`${API_URL}/exercise/milestones?${query.toString()}`, {
      headers: getAuthHeaders(),
    });
    const result = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(getErrorMessage(result, 'Failed to fetch milestones'));
    return result;
  },

  async getRecentHistory(childId, limit = 10) {
    const query = new URLSearchParams();
    if (childId) query.append('childId', childId);
    if (limit) query.append('limit', limit);

    const response = await fetch(`${API_URL}/exercise/history?${query.toString()}`, {
      headers: getAuthHeaders(),
    });
    const result = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(getErrorMessage(result, 'Failed to fetch recent history'));
    return result;
  },

  async getPlaybackUrl(exerciseId) {
    const response = await fetch(`${API_URL}/exercise/playback-url/${exerciseId}`, {
      headers: getAuthHeaders(),
    });
    const result = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(getErrorMessage(result, 'Failed to fetch playback URL'));
    return result;
  },
};
