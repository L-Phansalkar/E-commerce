import React, {useEffect} from 'react';
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

const CartFunctional = ({openOrder, dispatch}) => {
  console.log('openOrder', openOrder);
  const existing = JSON.parse(localStorage.getItem('cart'));

  const subtractGuestItem = (item) => {};

  const addGuestItem = (item) => {};

  const deleteGuestItem = (item) => {};

  useEffect(() => {
    dispatch(getCurrOrder());
  }, [dispatch]);

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
  };

  const checkoutOrder = (id) => {
    console.log(id);
    dispatch(stripeCheckout(id));
  };

  return (
    <div id="cart">
      {/* this is for logged in guest */}

      {openOrder.productOrders ? (
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
      ) : null}

      {/* this is for not logged in guest  */}

      {existing && (
        <List sx={{bgcolor: 'background.paper'}}>
          {existing.map((item) => (
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
                  </React.Fragment>
                }
              />
            </ListItem>
          ))}
          <Button
            variant="contained"
            onClick={() => {
              deleteItem(item);
            }}
          >
            <Link to="/login}">Log In to Check Out</Link>
          </Button>
        </List>
      )}
    </div>
  );
};

const mapState = (state) => ({
  openOrder: state.order,
});

export default connect(mapState)(CartFunctional);
