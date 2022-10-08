import axios from 'axios'

const UPDATE_OPEN_ORDER = 'UPDATE_OPEN_ORDER'
const DECREASE_QUANTITY = 'DECREASE_QUANTITY'
const DELETE_CART_ITEM = 'DELETE_CART_ITEM'

const updateOpenOrder = currentOrder => ({
  type: UPDATE_OPEN_ORDER,
  currentOrder
})

const decreaseProductQuant = currentOrder => ({
  type: DECREASE_QUANTITY,
  currentOrder
})

const deleteProductFromCart = currentOrder => ({
  type: DELETE_CART_ITEM,
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
export const decreaseCurrProd = (productId, orderId) => {
  return async dispatch => {
    try {
      const {data} = await axios.put(
        `/api/productOrders/${productId}/${orderId}`
      )
      dispatch(decreaseProductQuant(data))
    } catch (err) {
      console.log(err)
    }
  }
}
export const deleteCurrProd = (productId, orderId) => {
  return async dispatch => {
    try {
      const {data} = await axios.delete(
        `/api/productOrders/${productId}/${orderId}`
      )
      dispatch(deleteProductFromCart(data))
    } catch (err) {
      console.log(err)
    }
  }
}

export default function(state = [], action) {
  switch (action.type) {
    case UPDATE_OPEN_ORDER:
      return action.currentOrder
    case DECREASE_QUANTITY:
      return action.currentOrder
    case DELETE_CART_ITEM:
      return action.currentOrder
    default:
      return state
  }
}
