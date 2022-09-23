import axios from 'axios'

const GET_ALL_PRODUCTS = 'GET_ALL_PRODUCTS'
const GET_SINGLE_PRODUCT = 'GET_SINGLE_PRODUCT'

const fetchProducts = products => ({
  type: GET_ALL_PRODUCTS,
  products
})
const fetchSingleProduct = product => ({
  type: GET_SINGLE_PRODUCT,
  product
})

export const getAllProducts = () => {
  return async dispatch => {
    try {
      const {data} = await axios.get('/api/products/')

      dispatch(fetchProducts(data))
    } catch (err) {
      console.log(err)
    }
  }
}
export const getOneProduct = id => {
  return async dispatch => {
    try {
      const {data} = await axios.get(`/api/products/${id}`)
      dispatch(fetchSingleProduct(data))
    } catch (err) {
      console.log(err)
    }
  }
}

export default function(state = [], action) {
  switch (action.type) {
    case GET_ALL_PRODUCTS:
      return action.products

    case GET_SINGLE_PRODUCT:
      return action.product
    default:
      return state
  }
}
