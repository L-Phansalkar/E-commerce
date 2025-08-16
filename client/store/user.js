import { api, setAuthToken } from '../api/config';
import history from '../history';

/**
 * ACTION TYPES
 */
const GET_USER = 'GET_USER';
const REMOVE_USER = 'REMOVE_USER';
const CREATE_USER = 'CREATE_USER';

/**
 * INITIAL STATE
 */
const defaultUser = {};

/**
 * ACTION CREATORS
 */
const getUser = (user) => ({type: GET_USER, user});
const removeUser = () => ({type: REMOVE_USER});
const createUser = (user) => ({type: CREATE_USER, user});

/**
 * THUNK CREATORS
 */
export const me = () => async (dispatch) => {
  try {
    const userData = await api.auth.me();
    dispatch(getUser(userData || defaultUser));
  } catch (err) {
    console.error('Failed to get current user:', err);
    // If token is invalid, remove it
    setAuthToken(null);
    dispatch(getUser(defaultUser));
  }
};
// Add this new thunk to handle cart transfer after login
export const transferGuestCart = () => async dispatch => {
  try {
    // Get cart from localStorage
    const localCart = JSON.parse(localStorage.getItem('cart') || '[]');
    
    if (localCart.length > 0) {
      // Get the current order
      const orderResponse = await axios.get('/api/orders');
      const orderId = orderResponse.data.id;
      
      // Add each item from localStorage to the database
      for (const item of localCart) {
        // Add product to order (this will handle quantity updates)
        for (let i = 0; i < item.quantity; i++) {
          await axios.post(`/api/productOrders/${item.productId}/${orderId}`);
        }
      }
      
      // Clear localStorage after successful transfer
      localStorage.removeItem('cart');
      
      // Refresh the order to get updated cart
      dispatch(getCurrOrder());
    }
  } catch (error) {
    console.error('Error transferring cart:', error);
  }
};

// Update the auth thunk to transfer cart after login
export const auth = (email, password, method) => async dispatch => {
  let res;
  try {
    res = await axios.post(`/auth/${method}`, {email, password});
  } catch (authError) {
    return dispatch(getUser({error: authError}));
  }

  try {
    dispatch(getUser(res.data));
    
    // Transfer guest cart to user account after successful login
    await dispatch(transferGuestCart());
    
    history.push('/cart');
  } catch (dispatchOrHistoryErr) {
    console.error(dispatchOrHistoryErr);
  }
};



export const logout = () => async (dispatch) => {
  try {
    await api.auth.logout();
  } catch (err) {
    console.error('Logout error:', err);
  } finally {
    // Always remove token and user data, even if logout API call fails
    setAuthToken(null);
    dispatch(removeUser());
    history.push('/login');
  }
};

/**
 * REDUCER
 */
export default function (state = defaultUser, action) {
  switch (action.type) {
    case GET_USER:
      return action.user;
      case CREATE_USER:
      return action.user;
    case REMOVE_USER:
      return defaultUser;
    default:
      return state;
  }
}