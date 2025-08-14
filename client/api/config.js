// API Configuration with JWT Authentication Support

// Determine API base URL based on environment
const getApiBaseUrl = () => {
  if (typeof window !== 'undefined') {
    // Client-side
    const hostname = window.location.hostname;
    
    if (hostname === 'localhost' || hostname === '127.0.0.1') {
      // Local development - use your worker URL for testing
      return 'https://billy-bass-api.bf2kc5fx4x.workers.dev';
    } else if (hostname.includes('pages.dev')) {
      // Cloudflare Pages deployment - use your worker URL
      return 'https://billy-bass-api.bf2kc5fx4x.workers.dev';
    } else {
      // Production or custom domain
      return 'https://billy-bass-api.bf2kc5fx4x.workers.dev';
    }
  }
  
  // Server-side or fallback
  return process.env.REACT_APP_API_URL || 'https://billy-bass-api.bf2kc5fx4x.workers.dev';
};

const API_BASE_URL = getApiBaseUrl();

// Enhanced API call function with JWT support
const apiCall = async (url, options = {}) => {
  try {
    // Get token from localStorage
    const token = typeof window !== 'undefined' ? localStorage.getItem('authToken') : null;
    
    // Set up headers
    const headers = {
      'Content-Type': 'application/json',
      ...options.headers,
    };
    
    // Add Authorization header if token exists
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    
    // Make the request - REMOVE credentials: 'include'
    const response = await fetch(url, {
      ...options,
      headers,
      // Don't include credentials since we're using JWT tokens
    });
    
    // Handle non-OK responses
    if (!response.ok) {
      // Check for 401 Unauthorized
      if (response.status === 401) {
        // Token might be expired or invalid
        // Remove it from localStorage
        if (typeof window !== 'undefined') {
          localStorage.removeItem('authToken');
        }
      }
      
      // Try to get error message from response
      let errorMessage = `API call failed: ${response.statusText}`;
      try {
        const errorData = await response.json();
        errorMessage = errorData.error || errorData.message || errorMessage;
      } catch (e) {
        // Response might not be JSON
      }
      
      const error = new Error(errorMessage);
      error.status = response.status;
      throw error;
    }
    
    // Parse JSON response
    return response.json();
  } catch (error) {
    console.error('API call error:', error);
    throw error;
  }
};

// API methods object for structured calls
const api = {
  // Authentication endpoints
  auth: {
    login: (credentials) => apiCall(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      body: JSON.stringify(credentials)
    }),
    
    logout: () => apiCall(`${API_BASE_URL}/auth/logout`, {
      method: 'POST'
    }),
    
    signup: (userData) => apiCall(`${API_BASE_URL}/auth/signup`, {
      method: 'POST',
      body: JSON.stringify(userData)
    }),
    
    me: () => apiCall(`${API_BASE_URL}/auth/me`)
  },
  
  // Products endpoints (public)
  products: {
    getAll: () => apiCall(`${API_BASE_URL}/api/products`),
    
    getById: (id) => apiCall(`${API_BASE_URL}/api/products/${id}`),
    
    increaseInventory: (id) => apiCall(`${API_BASE_URL}/api/products/${id}/plus`, {
      method: 'PUT'
    }),
    
    decreaseInventory: (id) => apiCall(`${API_BASE_URL}/api/products/${id}/minus`, {
      method: 'PUT'
    })
  },
  
  // Orders endpoints (works for both guests and authenticated users)
  orders: {
    getCurrent: () => apiCall(`${API_BASE_URL}/api/orders`),
    
    // For checkout or order history (requires auth)
    checkout: (orderId) => apiCall(`${API_BASE_URL}/api/orders/${orderId}/checkout`, {
      method: 'POST'
    })
  },
  
  // Product Orders (cart items) - works for both guests and authenticated users
  productOrders: {
    add: (productId, orderId) => apiCall(`${API_BASE_URL}/api/productOrders/${productId}/${orderId}`, {
      method: 'POST'
    }),
    
    decreaseQuantity: (productId, orderId) => apiCall(`${API_BASE_URL}/api/productOrders/${productId}/${orderId}`, {
      method: 'PUT'
    }),
    
    remove: (productId, orderId) => apiCall(`${API_BASE_URL}/api/productOrders/${productId}/${orderId}`, {
      method: 'DELETE'
    })
  },
  
  // Admin/Setup endpoints
  admin: {
    initDb: () => apiCall(`${API_BASE_URL}/init-db`),
    
    seedProducts: () => apiCall(`${API_BASE_URL}/seed-products`, {
      method: 'POST'
    })
  }
};

// Helper function to set the auth token (useful after login/signup)
export const setAuthToken = (token) => {
  if (token) {
    localStorage.setItem('authToken', token);
  } else {
    localStorage.removeItem('authToken');
  }
};

// Helper function to get the auth token
export const getAuthToken = () => {
  return typeof window !== 'undefined' ? localStorage.getItem('authToken') : null;
};

// Helper function to check if user is authenticated
export const isAuthenticated = () => {
  return !!getAuthToken();
};

// Export the API object and base URL
export { api, API_BASE_URL, apiCall };

// Default export for backward compatibility
export default api;