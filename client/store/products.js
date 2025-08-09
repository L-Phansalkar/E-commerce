import apiCall from '../api/config';

const GET_ALL_PRODUCTS = 'GET_ALL_PRODUCTS';

const fetchProducts = (products) => ({
  type: GET_ALL_PRODUCTS,
  products,
});

export const getAllProducts = () => {
  return async (dispatch) => {
    try {
      const data = await apiCall('api/products');
      dispatch(fetchProducts(data));
    } catch (err) {
      console.log(err);
    }
  };
};

export default function (state = [], action) {
  switch (action.type) {
    case GET_ALL_PRODUCTS:
      return action.products;
    default:
      return state;
  }
}
