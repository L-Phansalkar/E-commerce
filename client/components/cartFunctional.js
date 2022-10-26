import React, {useEffect, useState, setState} from 'react';
import {connect} from 'react-redux';
import {getCurrOrder, stripeCheckout} from '../store/orders';
import {subtractProductInv, addProductInv} from '../store/singleProduct';
import {
  updateCurrOrder,
  decreaseCurrProd,
  deleteCurrProd,
} from '../store/productOrders';
import {Link} from 'react-router-dom';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import {Button} from '@mui/material';
import toast, {Toaster} from 'react-hot-toast';

const CartFunctional = ({openOrder, dispatch}) => {
  let [cart, setCart] = useState([]);

  async function init() {
    const data = await localStorage.getItem('cart');
    setCart(JSON.parse(data));
  }
  useEffect(
    () => {
      dispatch(getCurrOrder());
      init();
    },
    [dispatch],
    cart
  );

  const subtractItem = (item) => {
    dispatch(decreaseCurrProd(item.product.id, openOrder.id));
    dispatch(addProductInv(item.product.id));
  };

  const addItem = (item) => {
    dispatch(subtractProductInv(item.product.id));
    dispatch(updateCurrOrder(item.product.id, openOrder.id));
  };

  const deleteItem = (item) => {
    dispatch(deleteCurrProd(item.product.id, openOrder.id));
    toast.success('Item Deleted From Cart');
  };

  const checkoutOrder = (id) => {
    console.log(id);
    dispatch(stripeCheckout(id));
  };

  const subtractGuestItem = (item) => {
    let existingCart = cart;
    let [updateQuant] = existingCart.filter(
      (e) => e.productId === item.productId
    );
    //need to check if the posterId already exists, if it does just update quantit
    updateQuant.quantity--;
    console.log(cart);
    setCart(existingCart);
    console.log(cart);
    localStorage.setItem('cart', JSON.stringify(cart));
    init();
  };

  const addGuestItem = (item) => {
    let existingCart = cart;
    let [updateQuant] = existingCart.filter(
      (e) => e.productId === item.productId
    );
    console.log(updateQuant);
    //need to check if the posterId already exists, if it does just update quantit
    updateQuant.quantity++;
    console.log(cart);
    setCart(existingCart);
    console.log(cart);
    localStorage.setItem('cart', JSON.stringify(cart));
    init();
  };

  const deleteGuestItem = (item) => {
    let existingCart = cart;
    let index = existingCart.findIndex((e) => e.productId === item.productId);
    existingCart.splice(index, 1);
    if (existingCart.length === 0) {
      setCart(null);
      localStorage.removeItem('cart');
    } else {
      setCart(existingCart);
      console.log(cart);
      localStorage.setItem('cart', JSON.stringify(cart));
    }
    init();
    toast.success('Item Deleted From Cart');
  };

  return (
    <div id="cart">
      {/* this is for logged in guest */}

      {openOrder.productOrders && (
        <List sx={{bgcolor: 'background.paper', p: 2}}>
          {openOrder.productOrders.map((item) => {
            const {quantity, product} = item;

            const showMinus = quantity > 1;

            return (
              <ListItem alignItems="center" key={product.name}>
                <ListItemAvatar>
                  <Avatar
                    sx={{width: 100, height: 100}}
                    alt={product.name}
                    src={product.image}
                  />
                </ListItemAvatar>
                <ListItemText
                  sx={{display: 'inline', p: 3}}
                  primary={<h3>{product.name}</h3>}
                  secondary={
                    <Typography
                      sx={{display: 'inline', alignItems: 'flex-end'}}
                      component="span"
                      variant="body2"
                      color="text.primary"
                    >
                      {quantity}
                      {`    at  $${product.price} each`}
                      <br />
                      {showMinus && (
                        <Button
                          variant="contained"
                          onClick={() => {
                            subtractItem(item);
                          }}
                        >
                          -
                        </Button>
                      )}

                      <Button
                        variant="contained"
                        onClick={() => {
                          addItem(item);
                        }}
                      >
                        +
                      </Button>

                      <Button
                        variant="contained"
                        onClick={() => {
                          deleteItem(item);
                        }}
                      >
                        REMOVE FROM CART
                      </Button>
                    </Typography>
                  }
                />
              </ListItem>
            );
          })}
          <Button
            variant="contained"
            onClick={() => {
              checkoutOrder(openOrder.id);
            }}
          >
            Checkout With Stripe
          </Button>
        </List>
      )}

      {/* this is for not logged in guest  */}

      {cart && (
        <List sx={{bgcolor: 'background.paper'}}>
          {cart.map((item) => (
            <ListItem alignItems="flex-start" key={item.name}>
              <ListItemAvatar>
                <Avatar
                  sx={{width: 100, height: 100}}
                  alt={item.name}
                  src={item.image}
                />
              </ListItemAvatar>
              <ListItemText
                primary={item.name}
                secondary={
                  <React.Fragment>
                    <Typography
                      sx={{display: 'inline'}}
                      component="span"
                      variant="body2"
                      color="text.primary"
                    >
                      {item.quantity}
                    </Typography>
                    {`    at  $${item.price} each`}
                    {item.quantity > 1 && (
                      <Button
                        variant="contained"
                        onClick={() => {
                          subtractGuestItem(item);
                        }}
                      >
                        -
                      </Button>
                    )}

                    <Button
                      variant="contained"
                      onClick={() => {
                        addGuestItem(item);
                      }}
                    >
                      +
                    </Button>

                    <Button
                      variant="contained"
                      onClick={() => {
                        deleteGuestItem(item);
                      }}
                    >
                      REMOVE FROM CART
                    </Button>
                  </React.Fragment>
                }
              />
            </ListItem>
          ))}
          <Button variant="contained">
            <Link to="/login">Log In to Check Out</Link>
          </Button>
        </List>
      )}
      {!cart && !openOrder.productOrders && (
        <div>
          <h1>Nothing here yet! </h1>
          <Button variant="contained">
            <Link to="/products">Click here to see All Products</Link>
          </Button>
        </div>
      )}
    </div>
  );
};

const mapState = (state) => ({
  openOrder: state.order,
  cart: state.cart,
});

export default connect(mapState)(CartFunctional);
