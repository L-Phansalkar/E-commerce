// Fixed API configuration for Cloudflare Worker
const API_BASE_URL = process.env.NODE_ENV === 'production'
  ? 'https://billy-bass-api.bf2kc5fx4x.workers.dev'
  : 'http://localhost:8080';

// Helper function for API calls with error handling
const apiCall = async (url, options = {}) => {
  try {
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers
      },
      ...options
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('API call failed:', error);
    throw error;
  }
};

// Main API function that your Redux stores expect
const api = async (endpoint, options = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;
  return apiCall(url, options);
};

// API methods object for structured calls
api.auth = {
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
};

// Products methods
api.products = {
  getAll: () => apiCall(`${API_BASE_URL}/api/products`),
  getOne: (id) => apiCall(`${API_BASE_URL}/api/products/${id}`),
  decreaseInventory: (id) => apiCall(`${API_BASE_URL}/api/products/${id}/minus`, {
    method: 'PUT'
  }),
  increaseInventory: (id) => apiCall(`${API_BASE_URL}/api/products/${id}/plus`, {
    method: 'PUT'
  })
};

// Orders methods
api.orders = {
  getCurrent: () => apiCall(`${API_BASE_URL}/api/orders`),
  create: (orderData) => apiCall(`${API_BASE_URL}/api/orders`, {
    method: 'POST',
    body: JSON.stringify(orderData)
  })
};

// Product Orders (Cart) methods
api.productOrders = {
  add: (productId, orderId) => apiCall(`${API_BASE_URL}/api/productOrders/${productId}/${orderId}`, {
    method: 'POST'
  }),
  decrease: (productId, orderId) => apiCall(`${API_BASE_URL}/api/productOrders/${productId}/${orderId}`, {
    method: 'PUT'
  }),
  remove: (productId, orderId) => apiCall(`${API_BASE_URL}/api/productOrders/${productId}/${orderId}`, {
    method: 'DELETE'
  })
};

// Legacy methods for backward compatibility
api.getProducts = () => api.products.getAll();
api.getProduct = (id) => api.products.getOne(id);

export default api;