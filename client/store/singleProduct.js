import axios from 'axios'
const GET_SINGLE_PRODUCT = 'GET_SINGLE_PRODUCT'
const fetchSingleProduct = product => ({
  type: GET_SINGLE_PRODUCT,
  product
})
export const getOneProduct = id => {
  return async dispatch => {
    try {
      const {data} = await axios.get(`/api/products/${id}`)
      dispatch(fetchSingleProduct(data))
      console.log('here')
    } catch (err) {
      console.log(err)
    }
  }
}
export default function(state = [], action) {
  switch (action.type) {
    case GET_SINGLE_PRODUCT:
      return action.product
    default:
      return state
  }
}
