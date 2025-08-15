import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link, useLocation } from 'react-router-dom';
import { logout } from '../store';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  Container,
  Chip,
  IconButton,
  Badge,
} from '@mui/material';
import {
  ShoppingCart,
  Person,
  Home,
  Storefront,
  Logout,
  Login,
  PersonAdd,
} from '@mui/icons-material';
import { useCart } from '../hooks/useCart';

const ModernNavbar = ({ handleClick, isLoggedIn, user }) => {
  const location = useLocation();
  const { cartItemCount } = useCart();

  const isActive = (path) => location.pathname === path;

  const NavButton = ({ to, children, icon, ...props }) => (
    <Button
      component={Link}
      to={to}
      startIcon={icon}
      sx={{
        ml: 2,
        color: isActive(to) ? 'secondary.main' : 'text.primary',
        fontWeight: isActive(to) ? 600 : 500,
        backgroundColor: isActive(to) ? 'secondary.light' : 'transparent',
        '&:hover': {
          backgroundColor: isActive(to) ? 'secondary.light' : 'grey.50',
        },
        borderRadius: 2,
        px: 2,
        py: 1,
      }}
      {...props}
    >
      {children}
    </Button>
  );

  return (
    <AppBar 
      position="sticky" 
      elevation={0}
      sx={{ 
        backgroundColor: 'white',
        borderBottom: '1px solid',
        borderColor: 'grey.200',
      }}
    >
      <Container maxWidth="xl">
        <Toolbar sx={{ justifyContent: 'space-between', py: 1 }}>
          {/* Logo/Brand */}
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Typography
              variant="h5"
              component={Link}
              to="/home"
              sx={{
                fontWeight: 700,
                color: 'text.primary',
                textDecoration: 'none',
                letterSpacing: '-0.02em',
                background: 'linear-gradient(45deg, #1a1a1a 30%, #2563eb 90%)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              Billy Bass Pro Shop
            </Typography>
          </Box>

          {/* Navigation Links */}
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <NavButton to="/home" icon={<Home />}>
              Home
            </NavButton>

            <NavButton to="/products" icon={<Storefront />}>
              Products
            </NavButton>

            <IconButton
              component={Link}
              to="/cart"
              sx={{
                ml: 2,
                color: isActive('/cart') ? 'secondary.main' : 'text.primary',
                backgroundColor: isActive('/cart') ? 'secondary.light' : 'transparent',
                '&:hover': {
                  backgroundColor: isActive('/cart') ? 'secondary.light' : 'grey.50',
                },
              }}
            >
              <Badge badgeContent={cartItemCount} color="secondary">
                <ShoppingCart />
              </Badge>
            </IconButton>

            {/* Auth Section */}
            <Box sx={{ ml: 3, display: 'flex', alignItems: 'center', gap: 1 }}>
              {isLoggedIn ? (
                <>
                  <Chip
                    avatar={<Person />}
                    label={user.email || 'User'}
                    variant="outlined"
                    sx={{
                      backgroundColor: 'grey.50',
                      '& .MuiChip-avatar': {
                        backgroundColor: 'secondary.main',
                        color: 'white',
                      },
                    }}
                  />
                  <Button
                    onClick={handleClick}
                    startIcon={<Logout />}
                    variant="outlined"
                    size="small"
                    sx={{ ml: 1 }}
                  >
                    Logout
                  </Button>
                </>
              ) : (
                <>
                  <Button
                    component={Link}
                    to="/login"
                    startIcon={<Login />}
                    variant="outlined"
                    size="small"
                  >
                    Login
                  </Button>
                  <Button
                    component={Link}
                    to="/signup"
                    startIcon={<PersonAdd />}
                    variant="contained"
                    size="small"
                    sx={{ ml: 1 }}
                  >
                    Sign Up
                  </Button>
                </>
              )}
            </Box>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

const mapState = (state) => ({
  isLoggedIn: !!state.user.id,
  user: state.user,
});

const mapDispatch = (dispatch) => ({
  handleClick() {
    dispatch(logout());
  },
});

ModernNavbar.propTypes = {
  handleClick: PropTypes.func.isRequired,
  isLoggedIn: PropTypes.bool.isRequired,
  user: PropTypes.object,
};

export default connect(mapState, mapDispatch)(ModernNavbar);