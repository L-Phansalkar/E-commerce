import axios from 'axios';

const GET_OPEN_ORDER = 'GET_OPEN_ORDER';
// const GET_GUEST_ORDER = 'GET_GUEST_ORDER'

const getOpenOrder = (openOrder) => ({
  type: GET_OPEN_ORDER,
  openOrder,
});

// const getGuestOrder = guestOrder => ({
//   type: GET_GUEST_ORDER,
//   guestOrder
// })

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
// export const getGstOrder = (guestId) => {
//   return async dispatch => {
//     try {
//       const {data} = await axios.get(`/api/orders/${guestId}`)
//       dispatch(getGuestOrder(data))
//     } catch (err) {
//       console.log(err)
//     }
//   }
// }

export default function (state = [], action) {
  switch (action.type) {
    case GET_OPEN_ORDER:
      return action.openOrder;
    // case GET_GUEST_ORDER:
    //   return action.guestOrder
    default:
      return state;
  }
}
