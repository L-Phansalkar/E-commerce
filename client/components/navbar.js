import React from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {Link} from 'react-router-dom';
import {logout} from '../store';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';

const Navbar = ({handleClick, isLoggedIn}) => (
  <div>
    <Box sx={{flexGrow: 1}}>
      <AppBar position="static">
        {isLoggedIn ? (
          <Toolbar>
            <Typography variant="h6" component="div" sx={{flexGrow: 1}}>
              <h2 style={{
                fontFamily: 'Press Start 2P, monospace',
                background: 'linear-gradient(45deg, #ff0040, #ff6600, #ffff00, #00ff40, #00ffff, #8000ff)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                fontSize: '1.5rem',
                letterSpacing: '3px',
                textTransform: 'uppercase',
                animation: 'glitchText 3s ease-in-out infinite'
              }}>
                WOMEN FISH & ME
              </h2>
            </Typography>
            <Button 
              color="secondary"
              sx={{ 
                fontFamily: 'VT323, monospace', 
                fontSize: '1.2rem',
                letterSpacing: '2px',
                mx: 1
              }}
            >
              <Link 
                to="/products" 
                style={{ 
                  color: '#00ffff', 
                  textDecoration: 'none',
                  textTransform: 'uppercase'
                }}
              >
                MEME CAPS
              </Link>
            </Button>
            <Button 
              color="inherit"
              sx={{ 
                fontFamily: 'VT323, monospace', 
                fontSize: '1.2rem',
                letterSpacing: '2px',
                mx: 1
              }}
            >
              <Link 
                to="/cart" 
                style={{ 
                  color: '#00ffff', 
                  textDecoration: 'none',
                  textTransform: 'uppercase'
                }}
              >
                REALITY
              </Link>
            </Button>
            <Button 
              color="inherit"
              sx={{ 
                fontFamily: 'VT323, monospace', 
                fontSize: '1.2rem',
                letterSpacing: '2px',
                mx: 1
              }}
            >
              <Link 
                to="/home" 
                style={{ 
                  color: '#00ffff', 
                  textDecoration: 'none',
                  textTransform: 'uppercase'
                }}
              >
                DIMENSION
              </Link>
            </Button>
            <Button
              color="inherit"
              onClick={() => {
                handleClick();
              }}
              sx={{ 
                fontFamily: 'VT323, monospace', 
                fontSize: '1.2rem',
                letterSpacing: '2px',
                mx: 1,
                textTransform: 'uppercase'
              }}
            >
              LOGOUT
            </Button>
          </Toolbar>
        ) : (
          <Toolbar>
            <Typography variant="h6" component="div" sx={{flexGrow: 1}}>
              <h2 style={{
                fontFamily: 'Press Start 2P, monospace',
                background: 'linear-gradient(45deg, #ff0040, #ff6600, #ffff00, #00ff40, #00ffff, #8000ff)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                fontSize: '1.5rem',
                letterSpacing: '3px',
                textTransform: 'uppercase',
                animation: 'glitchText 3s ease-in-out infinite'
              }}>
                WOMEN FISH & ME
              </h2>
            </Typography>
            <Button 
              color="inherit"
              sx={{ 
                fontFamily: 'VT323, monospace', 
                fontSize: '1.2rem',
                letterSpacing: '2px',
                mx: 1
              }}
            >
              <Link 
                to="/products" 
                style={{ 
                  color: '#00ffff', 
                  textDecoration: 'none',
                  textTransform: 'uppercase'
                }}
              >
                MEME CAPS
              </Link>
            </Button>
            <Button 
              color="inherit"
              sx={{ 
                fontFamily: 'VT323, monospace', 
                fontSize: '1.2rem',
                letterSpacing: '2px',
                mx: 1
              }}
            >
              <Link 
                to="/cart" 
                style={{ 
                  color: '#00ffff', 
                  textDecoration: 'none',
                  textTransform: 'uppercase'
                }}
              >
                REALITY
              </Link>
            </Button>
            <Button 
              color="inherit"
              sx={{ 
                fontFamily: 'VT323, monospace', 
                fontSize: '1.2rem',
                letterSpacing: '2px',
                mx: 1
              }}
            >
              <Link 
                to="/home" 
                style={{ 
                  color: '#00ffff', 
                  textDecoration: 'none',
                  textTransform: 'uppercase'
                }}
              >
                DIMENSION
              </Link>
            </Button>
            <Button 
              color="inherit"
              sx={{ 
                fontFamily: 'VT323, monospace', 
                fontSize: '1.2rem',
                letterSpacing: '2px',
                mx: 1
              }}
            >
              <Link 
                to="/login" 
                style={{ 
                  color: '#00ffff', 
                  textDecoration: 'none',
                  textTransform: 'uppercase'
                }}
              >
                ENTER
              </Link>
            </Button>
            <Button 
              color="inherit"
              sx={{ 
                fontFamily: 'VT323, monospace', 
                fontSize: '1.2rem',
                letterSpacing: '2px',
                mx: 1
              }}
            >
              <Link 
                to="/signup" 
                style={{ 
                  color: '#00ffff', 
                  textDecoration: 'none',
                  textTransform: 'uppercase'
                }}
              >
                JOIN
              </Link>
            </Button>
          </Toolbar>
        )}
      </AppBar>
    </Box>
  </div>
);

/**
 * CONTAINER
 */
const mapState = (state) => {
  return {
    isLoggedIn: !!state.user.id,
  };
};

const mapDispatch = (dispatch) => {
  return {
    handleClick() {
      dispatch(logout());
    },
  };
};

export default connect(mapState, mapDispatch)(Navbar);

/**
 * PROP TYPES
 */
Navbar.propTypes = {
  handleClick: PropTypes.func.isRequired,
  isLoggedIn: PropTypes.bool.isRequired,
};