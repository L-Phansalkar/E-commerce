import axios from 'axios'

const UPDATE_OPEN_ORDER = 'UPDATE_OPEN_ORDER'

const updateOpenOrder = currentOrder => ({
  type: UPDATE_OPEN_ORDER,
  currentOrder
})

export const updateCurrOrder = (productId, orderId) => {
  return async dispatch => {
    try {
      const {data} = await axios.post(
        `/api/productOrders/${productId}/${orderId}`
      )
      dispatch(updateOpenOrder(data))
    } catch (err) {
      console.log(err)
    }
  }
}

export default function(state = [], action) {
  switch (action.type) {
    case UPDATE_OPEN_ORDER:
      return action.currentOrder

    default:
      return state
  }
}
