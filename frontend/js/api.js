/**
 * EduLearn - Central API Fetch Client
 * Handles Authorization headers, token persistence, and error parsing.
 */

// Configurable API base URL. If frontend is served from static port 3000/5500,
// and Flask runs on 5000, fallback or auto-detect origin.
const API_BASE_URL = window.EDU_LEARN_API_URL || (
  window.location.port === '5000' 
    ? '/api' 
    : (window.location.origin.includes('localhost') || window.location.origin.includes('127.0.0.1'))
      ? '/api'
      : '/api'
);

class ApiClient {
  constructor(baseUrl = API_BASE_URL) {
    this.baseUrl = baseUrl;
  }

  getToken() {
    return localStorage.getItem('edulearn_token');
  }

  setToken(token) {
    if (token) {
      localStorage.setItem('edulearn_token', token);
    } else {
      localStorage.removeItem('edulearn_token');
    }
  }

  getCurrentUser() {
    const userJson = localStorage.getItem('edulearn_user');
    try {
      return userJson ? JSON.parse(userJson) : null;
    } catch (e) {
      return null;
    }
  }

  setCurrentUser(user) {
    if (user) {
      localStorage.setItem('edulearn_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('edulearn_user');
    }
  }

  logout() {
    this.setToken(null);
    this.setCurrentUser(null);
    window.location.href = 'login.html';
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseUrl}${endpoint.startsWith('/') ? '' : '/'}${endpoint}`;
    
    const headers = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    const token = this.getToken();
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const config = {
      ...options,
      headers,
    };

    try {
      const response = await fetch(url, config);
      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        if (response.status === 401) {
          // Token expired or invalid
          const isAuthPage = window.location.pathname.includes('login.html');
          const isProtectedPage = 
            window.location.pathname.includes('dashboard.html') || 
            window.location.pathname.includes('profile.html') ||
            window.location.pathname.includes('lesson-player.html');

          if (!isAuthPage && isProtectedPage) {
            this.setToken(null);
            this.setCurrentUser(null);
            window.location.href = `login.html?redirect=${encodeURIComponent(window.location.pathname + window.location.search)}`;
          }
        }

        const errorMessage = data?.error?.message || data?.message || `Request failed with status ${response.status}`;
        const error = new Error(errorMessage);
        error.status = response.status;
        error.data = data;
        throw error;
      }

      return data;
    } catch (err) {
      // Network failure or parsed error
      throw err;
    }
  }

  // HTTP Method shortcuts
  get(endpoint, options = {}) {
    return this.request(endpoint, { ...options, method: 'GET' });
  }

  post(endpoint, body, options = {}) {
    return this.request(endpoint, {
      ...options,
      method: 'POST',
      body: JSON.stringify(body),
    });
  }

  put(endpoint, body, options = {}) {
    return this.request(endpoint, {
      ...options,
      method: 'PUT',
      body: JSON.stringify(body),
    });
  }

  delete(endpoint, options = {}) {
    return this.request(endpoint, { ...options, method: 'DELETE' });
  }
}

// Global API instance
window.api = new ApiClient();
