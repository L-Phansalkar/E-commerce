import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { getCurrOrder, stripeCheckout } from '../store/orders';
import { subtractProductInv, addProductInv } from '../store/singleProduct';
import {
  updateCurrOrder,
  decreaseCurrProd,
  deleteCurrProd,
} from '../store/productOrders';
import { Link } from 'react-router-dom';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import { Button } from '@mui/material';
import toast, { Toaster } from 'react-hot-toast';

const CartFunctional = ({ openOrder, dispatch, user }) => {
  const [cart, setCart] = useState([]);
  const [hasTransferredCart, setHasTransferredCart] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  // Check if user is logged in
  const isLoggedIn = user && user.id;

  // Load cart from localStorage
  const loadLocalCart = () => {
    const localCart = localStorage.getItem('cart');
    if (localCart) {
      try {
        const parsedCart = JSON.parse(localCart);
        setCart(parsedCart || []);
      } catch (error) {
        console.error('Error parsing local cart:', error);
        setCart([]);
      }
    } else {
      setCart([]);
    }
  };

  // Transfer cart from localStorage to database when user logs in
  const transferCartToDatabase = async () => {
    if (hasTransferredCart || !isLoggedIn || !openOrder.id) return;
    
    const localCart = localStorage.getItem('cart');
    if (!localCart) return;
    
    try {
      const parsedCart = JSON.parse(localCart);
      if (!parsedCart || parsedCart.length === 0) return;
      
      setIsLoading(true);
      
      // Transfer each item to the database
      for (const item of parsedCart) {
        // Add each quantity as a separate call to match the backend logic
        for (let i = 0; i < item.quantity; i++) {
          await dispatch(updateCurrOrder(item.productId, openOrder.id));
          await dispatch(subtractProductInv(item.productId));
        }
      }
      
      // Clear localStorage after successful transfer
      localStorage.removeItem('cart');
      setCart([]);
      setHasTransferredCart(true);
      
      // Refresh the order to get updated cart
      await dispatch(getCurrOrder());
      
      toast.success('Cart items transferred successfully!');
    } catch (error) {
      console.error('Error transferring cart:', error);
      toast.error('Failed to transfer some cart items');
    } finally {
      setIsLoading(false);
    }
  };

  // Initial load effect
  useEffect(() => {
    dispatch(getCurrOrder());
    
    // Only load localStorage cart if user is not logged in
    if (!isLoggedIn) {
      loadLocalCart();
    }
  }, [dispatch, isLoggedIn]);

  // Transfer cart when user logs in and order is ready
  useEffect(() => {
    if (isLoggedIn && openOrder.id && !hasTransferredCart) {
      transferCartToDatabase();
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
    toast.success('Item removed from cart');
  };

  const checkoutOrder = (id) => {
    dispatch(stripeCheckout(id));
  };

  // Guest user cart functions
  const subtractGuestItem = (item) => {
    const existingCart = [...cart];
    const itemToUpdate = existingCart.find(e => e.productId === item.productId);
    
    if (itemToUpdate) {
      if (itemToUpdate.quantity > 1) {
        itemToUpdate.quantity--;
        setCart(existingCart);
        localStorage.setItem('cart', JSON.stringify(existingCart));
      } else {
        // If quantity would be 0, remove the item
        deleteGuestItem(item);
      }
    }
  };

  const addGuestItem = (item) => {
    const existingCart = [...cart];
    const itemToUpdate = existingCart.find(e => e.productId === item.productId);
    
    if (itemToUpdate) {
      itemToUpdate.quantity++;
      setCart(existingCart);
      localStorage.setItem('cart', JSON.stringify(existingCart));
    }
  };

  const deleteGuestItem = (item) => {
    const existingCart = cart.filter(e => e.productId !== item.productId);
    
    if (existingCart.length === 0) {
      setCart([]);
      localStorage.removeItem('cart');
    } else {
      setCart(existingCart);
      localStorage.setItem('cart', JSON.stringify(existingCart));
    }
    toast.success('Item removed from cart');
  };

  // Calculate total for display
  const calculateTotal = () => {
    if (isLoggedIn && openOrder.productOrders) {
      return openOrder.productOrders.reduce(
        (total, item) => total + (item.product.price * item.quantity),
        0
      ).toFixed(2);
    } else if (cart && cart.length > 0) {
      return cart.reduce(
        (total, item) => total + (item.price * item.quantity),
        0
      ).toFixed(2);
    }
    return '0.00';
  };

  // Loading state
  if (isLoading) {
    return (
      <div style={{ textAlign: 'center', padding: '50px' }}>
        <h2>Transferring your cart...</h2>
        <p>Please wait while we sync your items.</p>
      </div>
    );
  }

  // Check if cart is empty
  const hasItems = (isLoggedIn && openOrder.productOrders && openOrder.productOrders.length > 0) ||
                   (!isLoggedIn && cart && cart.length > 0);

  return (
    <div id="cart">
      <h1 style={{ textAlign: 'center' }}>Shopping Cart</h1>
      
      {/* Display total if there are items */}
      {hasItems && (
        <div style={{ textAlign: 'center', margin: '20px 0' }}>
          <h3>Total: ${calculateTotal()}</h3>
        </div>
      )}

      {/* Logged-in user cart */}
      {isLoggedIn && openOrder.productOrders && openOrder.productOrders.length > 0 && (
        <List sx={{ bgcolor: 'background.paper', p: 2 }}>
          {openOrder.productOrders.map((item) => {
            const { quantity, product } = item;
            const showMinus = quantity > 1;

            return (
              <ListItem alignItems="center" key={product.id}>
                <ListItemAvatar>
                  <Avatar
                    sx={{ width: 100, height: 100 }}
                    alt={product.name}
                    src={product.image}
                  />
                </ListItemAvatar>
                <ListItemText
                  sx={{ display: 'inline', p: 3 }}
                  primary={<h3>{product.name}</h3>}
                  secondary={
                    <React.Fragment>
                      <Typography
                        sx={{ display: 'inline', alignItems: 'flex-end' }}
                        component="span"
                        variant="body2"
                        color="text.primary"
                      >
                        {quantity} at ${product.price} each
                      </Typography>
                      <br />
                      {showMinus && (
                        <Button
                          variant="contained"
                          onClick={() => subtractItem(item)}
                          style={{ margin: '5px' }}
                        >
                          -
                        </Button>
                      )}
                      <Button
                        variant="contained"
                        onClick={() => addItem(item)}
                        style={{ margin: '5px' }}
                      >
                        +
                      </Button>
                      <Button
                        variant="contained"
                        onClick={() => deleteItem(item)}
                        style={{ margin: '5px' }}
                      >
                        REMOVE FROM CART
                      </Button>
                    </React.Fragment>
                  }
                />
              </ListItem>
            );
          })}
          <div style={{ textAlign: 'center', marginTop: '20px' }}>
            <Button
              variant="contained"
              size="large"
              onClick={() => checkoutOrder(openOrder.id)}
            >
              Checkout With Stripe
            </Button>
          </div>
        </List>
      )}

      {/* Guest user cart */}
      {!isLoggedIn && cart && cart.length > 0 && (
        <List sx={{ bgcolor: 'background.paper' }}>
          {cart.map((item) => (
            <ListItem alignItems="flex-start" key={item.productId}>
              <ListItemAvatar>
                <Avatar
                  sx={{ width: 100, height: 100 }}
                  alt={item.name}
                  src={item.image}
                />
              </ListItemAvatar>
              <ListItemText
                primary={item.name}
                secondary={
                  <React.Fragment>
                    <Typography
                      sx={{ display: 'inline' }}
                      component="span"
                      variant="body2"
                      color="text.primary"
                    >
                      {item.quantity} at ${item.price} each
                    </Typography>
                    <br />
                    {item.quantity > 1 && (
                      <Button
                        variant="contained"
                        onClick={() => subtractGuestItem(item)}
                        style={{ margin: '5px' }}
                      >
                        -
                      </Button>
                    )}
                    <Button
                      variant="contained"
                      onClick={() => addGuestItem(item)}
                      style={{ margin: '5px' }}
                    >
                      +
                    </Button>
                    <Button
                      variant="contained"
                      onClick={() => deleteGuestItem(item)}
                      style={{ margin: '5px' }}
                    >
                      REMOVE FROM CART
                    </Button>
                  </React.Fragment>
                }
              />
            </ListItem>
          ))}
          <div style={{ textAlign: 'center', marginTop: '20px' }}>
            <Button variant="contained" size="large">
              <Link to="/login" style={{ color: 'white', textDecoration: 'none' }}>
                Log In to Check Out
              </Link>
            </Button>
          </div>
        </List>
      )}

      {/* Empty cart message */}
      {!hasItems && (
        <div style={{ textAlign: 'center', padding: '50px' }}>
          <h1>Nothing here yet!</h1>
          <Button variant="contained" size="large">
            <Link to="/products" style={{ color: 'white', textDecoration: 'none' }}>
              Click here to see All Products
            </Link>
          </Button>
        </div>
      )}

      <Toaster position="bottom-right" />
    </div>
  );
};

const mapState = (state) => ({
  openOrder: state.order,
  user: state.user,  // Add user to check login status
  cart: state.cart,
});

export default connect(mapState)(CartFunctional);