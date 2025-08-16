import React, {Component} from 'react';
import {connect} from 'react-redux';
import {withRouter, Route, Switch, Redirect} from 'react-router-dom';
import PropTypes from 'prop-types';
import {
  Login,
  Signup,
  UserHome,
  Home,
  AllProducts,
  SingleProduct,
  CartFunctional,
  Confirm,
} from './components';
import {me} from './store';

class Routes extends Component {
  componentDidMount() {
    this.props.loadInitialData();
  }

  render() {
    const {isLoggedIn} = this.props;
    const useNewCart = true;

    return (
      <Switch>
        {/* Add redirect from root to /home */}
        <Route exact path="/" render={() => <Redirect to="/home" />} />
        
        {/* Make /home available to all visitors */}
        <Route path="/home" component={Home} />
        
        {/* Routes available to all visitors */}
        <Route path="/login" component={Login} />
        <Route path="/signup" component={Signup} />
        <Route path="/cart" component={useNewCart ? CartFunctional : Cart} />
        <Route path="/confirm" component={Confirm} />
        <Route exact path="/products" component={AllProducts} />
        <Route exact path="/products/:id" component={SingleProduct} />
        
        {isLoggedIn && (
          <Switch>
            {/* Additional routes for logged-in users */}
            <Route path="/user-home" component={UserHome} />
          </Switch>
        )}
        
        {/* Default fallback to home instead of login */}
        <Route component={Home} />
      </Switch>
    );
  }
}

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
    loadInitialData() {
      dispatch(me());
    },
  };
};

export default withRouter(connect(mapState, mapDispatch)(Routes));

Routes.propTypes = {
  loadInitialData: PropTypes.func.isRequired,
  isLoggedIn: PropTypes.bool.isRequired,
};


