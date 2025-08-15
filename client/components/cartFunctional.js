import React, {useEffect, useState} from 'react';
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
import {
  getLocalCart,
  setLocalCart,
  clearLocalCart,
  updateLocalCartQuantity,
  removeFromLocalCart,
  transferCartToDatabase,
  isUserLoggedIn
} from '../utils/cartUtils';

const CartFunctional = ({openOrder, dispatch, user}) => {
  let [cart, setCart] = useState([]);
  let [isLoading, setIsLoading] = useState(false);
  let [hasTransferredCart, setHasTransferredCart] = useState(false);

  // Check if user is logged in
  const isLoggedIn = isUserLoggedIn(user);

  // Load localStorage cart
  const loadLocalCart = () => {
    const localCart = getLocalCart();
    setCart(localCart);
  };

  // Transfer localStorage cart to database when user logs in
  const handleCartTransfer = async () => {
    if (hasTransferredCart || !isLoggedIn || !openOrder.id) return;
    
    const localCart = getLocalCart();
    if (!localCart || localCart.length === 0) return;

    setIsLoading(true);
    try {
      const actions = {
        updateCurrOrder,
        subtractProductInv
      };
      
      const result = await transferCartToDatabase(
        localCart, 
        dispatch, 
        actions, 
        openOrder.id
      );
      
      if (result.success) {
        setCart([]);
        setHasTransferredCart(true);
        toast.success(result.message);
        
        // Refresh the order to show updated items
        await dispatch(getCurrOrder());
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      console.error('Error transferring cart:', error);
      toast.error('Failed to transfer cart items');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isLoggedIn) {
      // User is logged in - get their order
      dispatch(getCurrOrder());
    } else {
      // User is not logged in - load localStorage cart
      loadLocalCart();
    }
  }, [dispatch, isLoggedIn]);

  // Handle cart transfer when order is available and user is logged in
  useEffect(() => {
    if (isLoggedIn && openOrder.id && !hasTransferredCart) {
      handleCartTransfer();
    }
  }, [isLoggedIn, openOrder.id, hasTransferredCart]);

  // Logged-in user cart functions
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

  // Guest user cart functions
  const subtractGuestItem = (item) => {
    const updatedCart = updateLocalCartQuantity(item.productId, -1);
    setCart(updatedCart);
  };

  const addGuestItem = (item) => {
    const updatedCart = updateLocalCartQuantity(item.productId, 1);
    setCart(updatedCart);
  };

  const deleteGuestItem = (item) => {
    const updatedCart = removeFromLocalCart(item.productId);
    setCart(updatedCart);
  };

  const checkoutOrder = (id) => {
    dispatch(stripeCheckout(id));
  };

  // Loading state during cart transfer
  if (isLoading) {
    return (
      <div id="cart" style={{ textAlign: 'center', padding: '20px' }}>
        <h2>Transferring your cart...</h2>
        <Typography variant="body1">Please wait while we sync your items.</Typography>
      </div>
    );
  }

  return (
    <div id="cart">
      <Toaster />
      
      {/* Logged in user with items in cart */}
      {isLoggedIn && openOrder.productOrders && openOrder.productOrders.length > 0 && (
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
                    <React.Fragment>
                      <Typography
                        sx={{display: 'inline'}}
                        component="span"
                        variant="body2"
                        color="text.primary"
                      >
                        {quantity}
                      </Typography>
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
                    </React.Fragment>
                  }
                />
              </ListItem>
            );
          })}
          <Button 
            variant="contained" 
            onClick={() => checkoutOrder(openOrder.id)}
            sx={{ mt: 2 }}
          >
            Checkout With Stripe
          </Button>
        </List>
      )}

      {/* Guest user with items in localStorage */}
      {!isLoggedIn && cart && cart.length > 0 && (
        <List sx={{bgcolor: 'background.paper', p: 2}}>
          {cart.map((item) => {
            return (
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
            );
          })}
          <Button variant="contained" sx={{ mt: 2 }}>
            <Link to="/login">Log In to Check Out</Link>
          </Button>
        </List>
      )}

      {/* Empty cart states */}
      {/* Logged in user with no items */}
      {isLoggedIn && (!openOrder.productOrders || openOrder.productOrders.length === 0) && (
        <div>
          <h1>Your cart is empty!</h1>
          <Button variant="contained">
            <Link to="/products">Click here to see All Products</Link>
          </Button>
        </div>
      )}

      {/* Guest user with no items */}
      {!isLoggedIn && (!cart || cart.length === 0) && (
        <div>
          <h1>Nothing here yet!</h1>
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
  user: state.user, // Add user to props
});

export default connect(mapState)(CartFunctional);