import React, { useState } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { auth } from '../store';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Alert from '@mui/material/Alert';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import Paper from '@mui/material/Paper';
import CircularProgress from '@mui/material/CircularProgress';

/**
 * COMPONENT
 */
const AuthForm = (props) => {
  const { name, displayName, handleSubmit, error } = props;
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [validationErrors, setValidationErrors] = useState({});

  const validateForm = () => {
    const errors = {};
    
    // Email validation
    if (!formData.email) {
      errors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = 'Please enter a valid email address';
    }
    
    // Password validation
    if (!formData.password) {
      errors.password = 'Password is required';
    } else if (name === 'signup' && formData.password.length < 6) {
      errors.password = 'Password must be at least 6 characters';
    }
    
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear validation error for this field when user starts typing
    if (validationErrors[name]) {
      setValidationErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setLoading(true);
    await handleSubmit(e, formData.email, formData.password);
    setLoading(false);
  };

  // Extract error message
  const getErrorMessage = () => {
    if (error?.response?.data) {
      return typeof error.response.data === 'string' 
        ? error.response.data 
        : error.response.data.error || 'An error occurred';
    }
    return null;
  };

  return (
    <Container component="main" maxWidth="xs">
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Paper elevation={3} sx={{ padding: 4, width: '100%' }}>
          <Typography component="h1" variant="h5" align="center" gutterBottom>
            {displayName}
          </Typography>
          
          <Box component="form" onSubmit={onSubmit} noValidate sx={{ mt: 1 }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              autoFocus
              value={formData.email}
              onChange={handleChange}
              error={!!validationErrors.email}
              helperText={validationErrors.email}
              disabled={loading}
            />
            
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete={name === 'login' ? 'current-password' : 'new-password'}
              value={formData.password}
              onChange={handleChange}
              error={!!validationErrors.password}
              helperText={validationErrors.password || (name === 'signup' ? 'Minimum 6 characters' : '')}
              disabled={loading}
            />
            
            {getErrorMessage() && (
              <Alert severity="error" sx={{ mt: 2 }}>
                {getErrorMessage()}
              </Alert>
            )}
            
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              disabled={loading}
            >
              {loading ? (
                <CircularProgress size={24} color="inherit" />
              ) : (
                displayName
              )}
            </Button>
            
            <Box sx={{ textAlign: 'center', mt: 2 }}>
              <Typography variant="body2" color="text.secondary">
                {name === 'login' ? (
                  <>
                    Don't have an account?{' '}
                    <a href="/signup" style={{ color: '#1976d2' }}>
                      Sign up
                    </a>
                  </>
                ) : (
                  <>
                    Already have an account?{' '}
                    <a href="/login" style={{ color: '#1976d2' }}>
                      Log in
                    </a>
                  </>
                )}
              </Typography>
            </Box>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};

/**
 * CONTAINER
 */
const mapLogin = (state) => {
  return {
    name: 'login',
    displayName: 'Log In',
    error: state.user.error,
  };
};

const mapSignup = (state) => {
  return {
    name: 'signup',
    displayName: 'Sign Up',
    error: state.user.error,
  };
};

const mapDispatch = (dispatch) => {
  return {
    handleSubmit(evt, email, password, name) {
      const formName = evt.target.getAttribute('name');
      const currentUrl = new URL(window.location.href);
    const path = currentUrl.pathname; // Gets the path part of the URL (e.g., /path/to/page.html)
    const lastSegment = path.split('/').pop(); // Gets the last segment of the path
      console.log(formName, name, lastSegment)

      return dispatch(auth(email, password, lastSegment));
    },
  };
};

export const Login = connect(mapLogin, mapDispatch)(AuthForm);
export const Signup = connect(mapSignup, mapDispatch)(AuthForm);

/**
 * PROP TYPES
 */
AuthForm.propTypes = {
  name: PropTypes.string.isRequired,
  displayName: PropTypes.string.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  error: PropTypes.object,
};