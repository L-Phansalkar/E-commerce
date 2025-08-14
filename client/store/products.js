import { api } from '../api/config';

const GET_ALL_PRODUCTS = 'GET_ALL_PRODUCTS';

const fetchProducts = (products) => ({
  type: GET_ALL_PRODUCTS,
  products,
});

export const getAllProducts = () => {
  return async (dispatch) => {
    try {
      console.log('Calling API endpoint: /api/products');
      // Use the correct API method
      const data = await api.products.getAll();
      console.log('API response:', data);
      dispatch(fetchProducts(data));
    } catch (err) {
      console.log('API Error:', err);
      console.log('Error details:', err.message);
      // Dispatch empty array to prevent crashes
      dispatch(fetchProducts([]));
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