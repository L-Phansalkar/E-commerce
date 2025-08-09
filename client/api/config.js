// client/api/config.js
const API_BASE_URL = 'https://billy-bass-api.bf2kc5fx4x.workers.dev';

// Generic API call function
const apiCall = async (endpoint, options = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;
  console.log(url);

  const defaultOptions = {
    headers: {
      'Content-Type': 'application/json',
    },
  };

  const finalOptions = {
    ...defaultOptions,
    ...options,
    headers: {
      ...defaultOptions.headers,
      ...options.headers,
    },
  };

  try {
    console.log('📤 Request options:', finalOptions); // Debug log
    const response = await fetch(url, finalOptions);
    console.log('📥 Response status:', response.status); // Debug log

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log('✅ API Response:', data); // Debug log
    return data;
  } catch (error) {
    console.error(`❌ API call failed for ${endpoint}:`, error);
    console.error('🔍 Full error:', error);
    throw error;
  }
};

export default apiCall;
