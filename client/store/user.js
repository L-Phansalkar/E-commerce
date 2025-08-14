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

export const auth = (email, password, method) => async (dispatch) => {
  try {
    let res;
    
    if (method === 'login') {
      res = await api.auth.login({ email, password });
    } else if (method === 'signup') {
      res = await api.auth.signup({ email, password });
    } else {
      throw new Error('Invalid auth method');
    }
    
    // Store the JWT token
    if (res.token) {
      setAuthToken(res.token);
    }
    
    // Dispatch user data
    dispatch(getUser(res.user || res));
    
    // Redirect to home page
    history.push('/home');
    
  } catch (authError) {
    console.error('Auth error:', authError);
    return dispatch(getUser({error: authError}));
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