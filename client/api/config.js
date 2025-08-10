// Updated API configuration for Cloudflare Worker
const API_BASE_URL = process.env.NODE_ENV === 'production' 
  ? 'https://billy-bass-api.bf2kc5fx4x.workers.dev/api'
  : 'http://localhost:8080/api';

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

export const api = {
  // Auth endpoints
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

  // User endpoints
  me: () => apiCall(`${API_BASE_URL}/auth/me`),
  
  // Products endpoints
  getProducts: () => apiCall(`${API_BASE_URL}/products`),
  getProduct: (id) => apiCall(`${API_BASE_URL}/products/${id}`),
  
  // Orders endpoints
  getOrders: () => apiCall(`${API_BASE_URL}/orders`),
  createOrder: (orderData) => apiCall(`${API_BASE_URL}/orders`, {
    method: 'POST',
    body: JSON.stringify(orderData)
  }),
  
  // Cart/Product Orders endpoints
  getCart: () => apiCall(`${API_BASE_URL}/orders/cart`),
  addToCart: (productId, quantity) => apiCall(`${API_BASE_URL}/orders/cart`, {
    method: 'POST',
    body: JSON.stringify({ productId, quantity })
  }),
  updateCartItem: (productOrderId, quantity) => apiCall(`${API_BASE_URL}/orders/cart/${productOrderId}`, {
    method: 'PUT',
    body: JSON.stringify({ quantity })
  }),
  removeFromCart: (productOrderId) => apiCall(`${API_BASE_URL}/orders/cart/${productOrderId}`, {
    method: 'DELETE'
  }),
  
  // Stripe endpoints
  createPaymentIntent: (amount) => apiCall(`${API_BASE_URL}/stripe/create-payment-intent`, {
    method: 'POST',
    body: JSON.stringify({ amount })
  })
};

export default api ;
