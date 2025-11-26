const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

class ApiClient {
  constructor() {
    this.baseUrl = API_URL;
  }

  getToken() {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('token');
    }
    return null;
  }

  setToken(token) {
    if (typeof window !== 'undefined') {
      localStorage.setItem('token', token);
    }
  }

  removeToken() {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('token');
    }
  }

  async request(endpoint, options = {}) {
    const token = this.getToken();
    const headers = {
      'Content-Type': 'application/json',
      ...options.headers,
    };
    
    // If body is FormData or URLSearchParams, let browser set content type (delete header)
    // or explicitly allow override if user passed specific content-type
    if (options.body instanceof FormData || options.body instanceof URLSearchParams) {
        delete headers['Content-Type'];
    }

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const config = {
      ...options,
      headers,
    };

    try {
      const res = await fetch(`${this.baseUrl}${endpoint}`, config);
      
      // Handle 401 Unauthorized - maybe redirect to login?
      if (res.status === 401) {
        // Optional: this.removeToken();
        // window.location.href = '/auth';
      }

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        let errorMessage = errorData.detail || `Error ${res.status}: ${res.statusText}`;
        if (typeof errorMessage === 'object') {
            errorMessage = JSON.stringify(errorMessage);
        }
        throw new Error(errorMessage);
      }

      // For 204 No Content
      if (res.status === 204) return null;

      return await res.json();
    } catch (error) {
      console.error('API Request Failed:', error);
      throw error;
    }
  }

  get(endpoint, options = {}) {
    return this.request(endpoint, { ...options, method: 'GET' });
  }

  post(endpoint, data, options = {}) {
    const isFormData = (typeof FormData !== 'undefined' && data instanceof FormData);
    const isUrlSearchParams = (typeof URLSearchParams !== 'undefined' && data instanceof URLSearchParams);
    
    return this.request(endpoint, {
      ...options,
      method: 'POST',
      body: (isFormData || isUrlSearchParams) ? data : JSON.stringify(data),
    });
  }

  put(endpoint, data, options = {}) {
    const isFormData = (typeof FormData !== 'undefined' && data instanceof FormData);
    const isUrlSearchParams = (typeof URLSearchParams !== 'undefined' && data instanceof URLSearchParams);

    return this.request(endpoint, {
      ...options,
      method: 'PUT',
      body: (isFormData || isUrlSearchParams) ? data : JSON.stringify(data),
    });
  }

  delete(endpoint, options = {}) {
    return this.request(endpoint, { ...options, method: 'DELETE' });
  }
}

export const api = new ApiClient();

