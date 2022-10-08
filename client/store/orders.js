import axios from 'axios';
import history from '../history';

const GET_OPEN_ORDER = 'GET_OPEN_ORDER';

const getOpenOrder = (openOrder) => ({
  type: GET_OPEN_ORDER,
  openOrder,
});

export const getCurrOrder = () => {
  return async (dispatch) => {
    try {
      const {data} = await axios.get(`/api/orders`);
      dispatch(getOpenOrder(data));
    } catch (err) {
      console.log(err);
    }
  };
};

export const stripeCheckout = (id) => {
  return async () => {
    try {
      const response = await axios.post(
        `/api/orders/${id}/create-checkout-session`
      );
      console.log('response', response);
      const {checkoutSessionUrl} = response.data;
      window.location.href = checkoutSessionUrl;
    } catch (err) {
      console.log(err);
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
