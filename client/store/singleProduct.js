import { api } from '../api/config';

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
      const data = await api.products.getById(id);
      dispatch(fetchSingleProduct(data));
    } catch (err) {
      console.log(err);
    }
  };
};

export const subtractProductInv = (id) => {
  return async (dispatch) => {
    try {
      const data = await api.products.decreaseInventory(id);
      dispatch(updateSingleProduct(data));
    } catch (err) {
      console.log(err);
    }
  };
};

export const addProductInv = (id) => {
  return async (dispatch) => {
    try {
      const data = await api.products.increaseInventory(id);
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