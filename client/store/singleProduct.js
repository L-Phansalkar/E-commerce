import axios from 'axios';

const GET_SINGLE_PRODUCT = 'GET_SINGLE_PRODUCT';
const UPDATE_PRODUCT_INVENTORY = 'UPDATE_PRODUCT_INVENTORY';

const fetchSingleProduct = (product) => ({
  type: GET_SINGLE_PRODUCT,
  product,
});

const updateSingleProduct = (product) => ({
  type: UPDATE_PRODUCT_INVENTORY,
  product,
});

export const getOneProduct = (id) => {
  return async (dispatch) => {
    try {
      const {data} = await axios.get(`/api/products/${id}`);
      dispatch(fetchSingleProduct(data));
    } catch (err) {
      console.log(err);
    }
  };
};

export const updateProductInv = (id) => {
  return async (dispatch) => {
    try {
      const {data} = await axios.put(`/api/products/${id}`);
      dispatch(updateSingleProduct(data));
    } catch (err) {
      console.log(err);
    }
  };
};

export default function (state = [], action) {
  switch (action.type) {
    case GET_SINGLE_PRODUCT:
      return action.product;
    case UPDATE_PRODUCT_INVENTORY:
      return action.product;
    default:
      return state;
  }
}
