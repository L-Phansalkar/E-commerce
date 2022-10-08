import React from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {getCurrOrder} from '../store/orders';
import {updateProductInv} from '../store/singleProduct';
import {updateCurrOrder} from '../store/productOrders';

/**
 * COMPONENT
 */

export class UserHome extends React.Component {
  componentDidMount() {
    console.log(this.props);
    this.props.getCurrentOrder();
  }
  // componentDidUpdate(){
  //   this.props.getCurrentOrder()
  // }
  render() {
    const {openOrder} = this.props;
    const {email} = this.props;
    console.log('open order', openOrder, email);
    var existing = JSON.parse(localStorage.getItem('cart'));
    if (openOrder && existing) {
      console.log('i got both');
      console.log('openOrderinsidewhile', this.props.openOrder);
      console.log('localStorage', existing);
      existing.forEach((item) => {
        var quantity = item.quantity;
        console.log('created', item.productId, quantity);
        while (quantity > 0) {
          this.props.updateProductInventory(item.productId);
          this.props.updateCurrentOrder(
            item.productId,
            this.props.openOrder.id
          );
          quantity = quantity - 1;
          console.log('after subtract', item.productId, quantity);
        }
      });
      localStorage.removeItem('cart');
    }

    return (
      <div>
        <h3>Welcome, {email}</h3>
      </div>
    );
  }
}

const mapState = (state) => {
  return {
    openOrder: state.order,
    email: state.user.email,
  };
};

const mapDispatch = (dispatch) => {
  return {
    getCurrentOrder: () => dispatch(getCurrOrder()),
    updateProductInventory: (id) => dispatch(updateProductInv(id)),
    updateCurrentOrder: (productId, openOrderid) =>
      dispatch(updateCurrOrder(productId, openOrderid)),
  };
};

export default connect(mapState, mapDispatch)(UserHome);

// export const UserHome = props => {
//   const {email} = props
//   var order = getCurrOrder()
//   console.log(order)

//   return (
//
//   )
// }

// /**
//  * CONTAINER
//  */
// const mapState = state => {
//   return {
//     email: state.user.email
//   }
// }
// // const mapDispatch = dispatch => {
// //   return {
// //     getCurrentOrder: () => dispatch(getCurrOrder()),
// //     updateProductInventory: id => dispatch(updateProductInv(id)),
// //     updateCurrentOrder: (productId, openOrderid) =>
// //     dispatch(updateCurrOrder(productId, openOrderid)),
// //   }
// // }

// export default connect(mapState)(UserHome)

// /**
//  * PROP TYPES
//  */
// UserHome.propTypes = {
//   email: PropTypes.string
// }
