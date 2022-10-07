import React from 'react'
import PropTypes from 'prop-types'
import {connect} from 'react-redux'
import {Link} from 'react-router-dom'
import {logout} from '../store'
import AppBar from '@mui/material/AppBar'
import Box from '@mui/material/Box'
import Toolbar from '@mui/material/Toolbar'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import appTheme from '../app'

// import MenuIcon from '@mui/icons-material';

const Navbar = ({handleClick, isLoggedIn}) => (
  <div>
    <Box sx={{flexGrow: 1}}>
      <AppBar position="static">
        {isLoggedIn ? (
          <Toolbar>
            <Typography variant="h6" component="div" sx={{flexGrow: 1}}>
              <h2>Big Mouth Billy Bass Pro Shop</h2>
            </Typography>
            <Button color="secondary">
              {' '}
              <Link to="/products">Products</Link>
            </Button>
            <Button color="inherit">
              {' '}
              <Link to="/cart">Cart</Link>
            </Button>
            <Button color="inherit">
              {' '}
              <Link to="/home">Home</Link>
            </Button>
            <Button
              color="inherit"
              onClick={() => {
                handleClick()
              }}
            >
              {' '}
              Logout
            </Button>
          </Toolbar>
        ) : (
          <Toolbar>
            <Typography variant="h6" component="div" sx={{flexGrow: 1}}>
              <h2>Big Mouth Billy Bass Pro Shop</h2>
            </Typography>
            <Button color="inherit">
              {' '}
              <Link to="/products">Products</Link>
            </Button>
            <Button color="inherit">
              {' '}
              <Link to="/cart">Cart</Link>
            </Button>
            <Button color="inherit">
              {' '}
              <Link to="/home">Home</Link>
            </Button>
            <Button color="inherit">
              {' '}
              <Link to="/login">Login</Link>
            </Button>
            <Button color="inherit">
              {' '}
              <Link to="/signup">Sign Up</Link>
            </Button>
          </Toolbar>
        )}
      </AppBar>
    </Box>
  </div>
)

/**
 * CONTAINER
 */
const mapState = state => {
  return {
    isLoggedIn: !!state.user.id
  }
}

const mapDispatch = dispatch => {
  return {
    handleClick() {
      dispatch(logout())
    }
  }
}

export default connect(mapState, mapDispatch)(Navbar)

/**
 * PROP TYPES
 */
Navbar.propTypes = {
  handleClick: PropTypes.func.isRequired,
  isLoggedIn: PropTypes.bool.isRequired
}
