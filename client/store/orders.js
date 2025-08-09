import apiCall from '../api/config';
import history from '../history';

const GET_OPEN_ORDER = 'GET_OPEN_ORDER';

const getOpenOrder = (openOrder) => ({
  type: GET_OPEN_ORDER,
  openOrder,
});

export const getCurrOrder = () => {
  return async (dispatch) => {
    try {
      const data = await apiCall('/api/orders');
      dispatch(getOpenOrder(data));
    } catch (err) {
      console.log(err);
      // If API fails, dispatch empty order to prevent app crashes
      dispatch(getOpenOrder({productOrders: []}));
    }
  };
};

export const stripeCheckout = (id) => {
  return async () => {
    try {
      const response = await apiCall(
        `/api/orders/${id}/create-checkout-session`,
        {
          method: 'POST',
        }
      );
      console.log('response', response);
      const {checkoutSessionUrl} = response;
      window.location.href = checkoutSessionUrl;
    } catch (err) {
      console.log('Stripe checkout not implemented in new API yet:', err);
      // For now, we'll just log the error since Stripe isn't implemented in the worker yet
    }
  };
};

export default function (state = [], action) {
  switch (action.type) {
    case GET_OPEN_ORDER:
      return action.openOrder;
    default:
      return state;
  }
}
