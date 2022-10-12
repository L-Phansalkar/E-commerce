import React from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {getCurrOrder} from '../store/orders';
import {subtractProductInv} from '../store/singleProduct';
import {updateCurrOrder} from '../store/productOrders';

/**
 * COMPONENT
 */

export class UserHome extends React.Component {
  componentDidMount() {
    console.log(this.props);
    this.props.getCurrentOrder();
  }

  render() {
    const {email} = this.props;
    const id = this.props.openOrder.id;
    console.log('id here', id);
    if (id) {
      console.log('props', this.props.openOrder);
      const existing = JSON.parse(localStorage.getItem('cart'));
      if (existing && this.props.openOrder) {
        console.log('igotbooooth');
        existing.forEach((item) => {
          var quantity = item.quantity;
          console.log('created', item.productId, quantity);
          while (quantity > 0) {
            this.props.updateProductInventory(item.productId);
            this.props.updateCurrentOrder(
              item.productId,
              this.props.openOrder.id
            );
            console.log('here');
            quantity = quantity - 1;
            console.log('after subtract', item.productId, quantity);
          }
        });
        localStorage.removeItem('cart');
      }
    }

    return (
      <div id="userhome">
        <h1>Welcome, {email}</h1>
      </div>
    );
  }
}

const mapState = (state) => {
  return {
    openOrder: state.order,
    email: state.user.email,
    id: state.user.id,
  };
};

const mapDispatch = (dispatch) => {
  return {
    getCurrentOrder: () => dispatch(getCurrOrder()),
    updateProductInventory: (id) => dispatch(subtractProductInv(id)),
    updateCurrentOrder: (productId, openOrderid) =>
      dispatch(updateCurrOrder(productId, openOrderid)),
  };
};

export default connect(mapState, mapDispatch)(UserHome);
