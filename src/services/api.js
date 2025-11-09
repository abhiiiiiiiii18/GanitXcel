import { auth } from '../config/firebase';

const API_URL = import.meta.env.VITE_API_URL || 'https://ganitxcel-backend.onrender.com/api';

// Helper function to get Firebase ID token
const getAuthToken = async () => {
  const user = auth.currentUser;
  if (!user) {
    throw new Error('User not authenticated');
  }
  return await user.getIdToken();
};

// API utility object
export const api = {
  /**
   * GET request
   * @param {string} endpoint - API endpoint (e.g., '/courses')
   * @param {object} options - Fetch options
   * @returns {Promise} JSON response
   */
  async get(endpoint, options = {}) {
    try {
      const token = await getAuthToken();
      const response = await fetch(`${API_URL}${endpoint}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          ...options.headers
        },
        ...options
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Request failed');
      }

      return data;
    } catch (error) {
      console.error('API GET Error:', error);
      throw error;
    }
  },

  /**
   * POST request
   * @param {string} endpoint - API endpoint
   * @param {object} body - Request body
   * @param {object} options - Fetch options
   * @returns {Promise} JSON response
   */
  async post(endpoint, body = {}, options = {}) {
    try {
      const token = await getAuthToken();
      const response = await fetch(`${API_URL}${endpoint}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          ...options.headers
        },
        body: JSON.stringify(body),
        ...options
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Request failed');
      }

      return data;
    } catch (error) {
      console.error('API POST Error:', error);
      throw error;
    }
  },

  /**
   * PATCH request
   * @param {string} endpoint - API endpoint
   * @param {object} body - Request body
   * @param {object} options - Fetch options
   * @returns {Promise} JSON response
   */
  async patch(endpoint, body = {}, options = {}) {
    try {
      const token = await getAuthToken();
      const response = await fetch(`${API_URL}${endpoint}`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          ...options.headers
        },
        body: JSON.stringify(body),
        ...options
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Request failed');
      }

      return data;
    } catch (error) {
      console.error('API PATCH Error:', error);
      throw error;
    }
  },

  /**
   * DELETE request
   * @param {string} endpoint - API endpoint
   * @param {object} options - Fetch options
   * @returns {Promise} JSON response
   */
  async delete(endpoint, options = {}) {
    try {
      const token = await getAuthToken();
      const response = await fetch(`${API_URL}${endpoint}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          ...options.headers
        },
        ...options
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Request failed');
      }

      return data;
    } catch (error) {
      console.error('API DELETE Error:', error);
      throw error;
    }
  },

  // Public endpoint (no auth required)
  async publicGet(endpoint, options = {}) {
    try {
      const response = await fetch(`${API_URL}${endpoint}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          ...options.headers
        },
        ...options
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Request failed');
      }

      return data;
    } catch (error) {
      console.error('API Public GET Error:', error);
      throw error;
    }
  }
};

// Specific API methods for common operations
export const courseAPI = {
  getAll: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return api.get(`/courses${query ? `?${query}` : ''}`);
  },
  getById: (courseId) => api.get(`/courses/${courseId}`),
  create: (courseData) => api.post('/courses', courseData),
  update: (courseId, updates) => api.patch(`/courses/${courseId}`, updates),
  delete: (courseId) => api.delete(`/courses/${courseId}`)
};

export const purchaseAPI = {
  purchase: (courseId, paymentMethod) => 
    api.post('/purchases', { courseId, paymentMethod }),
  getHistory: (userId) => api.get(`/purchases/user/${userId}`),
  checkOwnership: (userId, courseId) => 
    api.get(`/purchases/check/${userId}/${courseId}`)
};

export const aiAPI = {
  summarize: (lessonData) => api.post('/ai/summarize', lessonData),
  solveDoubt: (question, context) => 
    api.post('/ai/doubt', { question, context }),
  generatePractice: (topic, difficulty, count) =>
    api.post('/ai/practice', { topic, difficulty, count })
};

export const leaderboardAPI = {
  getTop: (limit = 10) => api.get(`/leaderboard?limit=${limit}`),
  getUserRank: (userId) => api.get(`/leaderboard/rank/${userId}`)
};

export const friendsAPI = {
  getFriends: (userId) => api.get(`/friends/${userId}`),
  sendRequest: (fromUserId, toUserId) => 
    api.post('/friends/request', { fromUserId, toUserId }),
  acceptRequest: (requestId) => api.post(`/friends/accept/${requestId}`),
  search: (query) => api.get(`/friends/search/${query}`)
};

export const certificateAPI = {
  generate: (userId, courseId) => 
    api.post('/certificates/generate', { userId, courseId }),
  getUserCertificates: (userId) => api.get(`/certificates/user/${userId}`),
  verify: (certificateId) => api.publicGet(`/certificates/verify/${certificateId}`)
};

export const recommendationsAPI = {
  getPersonalized: (limit = 10) => 
    api.get(`/recommendations?limit=${limit}`),
  getByTopic: (topic, limit = 5) => 
    api.get(`/recommendations/topic/${topic}?limit=${limit}`),
  getTrending: (limit = 6) => 
    api.get(`/recommendations/trending?limit=${limit}`)
};

export default api;
