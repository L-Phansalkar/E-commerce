import api from '../api/config';
import {getCurrOrder} from './orders';

const UPDATE_OPEN_ORDER = 'UPDATE_OPEN_ORDER';
const DECREASE_QUANTITY = 'DECREASE_QUANTITY';
const DELETE_CART_ITEM = 'DELETE_CART_ITEM';

// increase quantity, or add to cart
const updateOpenOrder = (currentOrder) => ({
  type: UPDATE_OPEN_ORDER,
  currentOrder,
});

const decreaseProductQuant = (currentOrder) => ({
  type: DECREASE_QUANTITY,
  currentOrder,
});

const deleteProductFromCart = (currentOrder) => ({
  type: DELETE_CART_ITEM,
  currentOrder,
});

export const updateCurrOrder = (productId, orderId) => {
  return async (dispatch) => {
    try {
      const data = await api(`/api/productOrders/${productId}/${orderId}`, {
        method: 'POST'
      });
      dispatch(updateOpenOrder(data));
      dispatch(getCurrOrder());
    } catch (err) {
      console.log(err);
    }
  };
};

export const decreaseCurrProd = (productId, orderId) => {
  return async (dispatch) => {
    try {
      const data = await api(`/api/productOrders/${productId}/${orderId}`, {
        method: 'PUT'
      });
      dispatch(decreaseProductQuant(data));
      dispatch(getCurrOrder());
    } catch (err) {
      console.log(err);
    }
  };
};

export const deleteCurrProd = (productId, orderId) => {
  return async (dispatch) => {
    try {
      const data = await api(`/api/productOrders/${productId}/${orderId}`, {
        method: 'DELETE'
      });
      dispatch(deleteProductFromCart(data));
      dispatch(getCurrOrder());
    } catch (err) {
      console.log(err);
    }
  };
};

export default function (state = {}, action) {
  switch (action.type) {
    case UPDATE_OPEN_ORDER:
      return action.currentOrder;
    case DECREASE_QUANTITY:
      return action.currentOrder;
    case DELETE_CART_ITEM:
      return action.currentOrder;
    default:
      return state;
  }
}