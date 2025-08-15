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
import {
  Box,
  Container,
  Typography,
  Card,
  CardMedia,
  IconButton,
  Button,
  Divider,
  Chip,
  Grid,
  Fade,
  Breadcrumbs,
  Link as MuiLink,
} from '@mui/material';
import {
  Add,
  Remove,
  Delete,
  ShoppingCart,
  Home,
  Storefront,
  ArrowForward,
  ShoppingBag,
  LocalShipping,
  Security,
} from '@mui/icons-material';
import toast, { Toaster } from 'react-hot-toast';
import {
  getLocalCart,
  updateLocalCartQuantity,
  removeFromLocalCart,
  transferCartToDatabase,
  isUserLoggedIn,
} from '../utils/cartUtils';

const ModernCart = ({ openOrder, dispatch, user }) => {
  const [cart, setCart] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasTransferredCart, setHasTransferredCart] = useState(false);

  const isLoggedIn = isUserLoggedIn(user);

  const loadLocalCart = () => {
    const localCart = getLocalCart();
    setCart(localCart);
  };

  const handleCartTransfer = async () => {
    if (hasTransferredCart || !isLoggedIn || !openOrder.id) return;

    const localCart = getLocalCart();
    if (!localCart || localCart.length === 0) return;

    setIsLoading(true);
    try {
      const actions = { updateCurrOrder, subtractProductInv };
      const result = await transferCartToDatabase(localCart, dispatch, actions, openOrder.id);

      if (result.success) {
        setCart([]);
        setHasTransferredCart(true);
        toast.success(result.message);
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
      dispatch(getCurrOrder());
    } else {
      loadLocalCart();
    }
  }, [dispatch, isLoggedIn]);

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
    toast.success('Item removed from cart');
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
    toast.success('Item removed from cart');
  };

  const checkoutOrder = (id) => {
    dispatch(stripeCheckout(id));
  };

  // Calculate totals
  const getCartItems = () => {
    if (isLoggedIn && openOrder.productOrders) {
      return openOrder.productOrders;
    }
    return cart;
  };

  const calculateTotal = () => {
    const items = getCartItems();
    if (isLoggedIn && openOrder.productOrders) {
      return openOrder.productOrders.reduce(
        (total, item) => total + item.product.price * item.quantity,
        0
      );
    }
    return cart.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  const CartItem = ({ item, isGuest = false }) => {
    const product = isGuest ? item : item.product;
    const quantity = item.quantity;
    const productId = isGuest ? item.productId : product.id;

    return (
      <Card
        sx={{
          mb: 2,
          overflow: 'hidden',
          transition: 'all 0.2s ease-in-out',
          '&:hover': {
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
          },
        }}
      >
        <Box sx={{ display: 'flex', p: 3 }}>
          {/* Product Image */}
          <Box
            sx={{
              width: 120,
              height: 120,
              borderRadius: 2,
              overflow: 'hidden',
              mr: 3,
              flexShrink: 0,
            }}
          >
            <CardMedia
              component="img"
              image={isGuest ? item.image : product.image}
              alt={isGuest ? item.name : product.name}
              sx={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
              }}
            />
          </Box>

          {/* Product Details */}
          <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
            <Typography
              variant="h6"
              component="h3"
              sx={{ fontWeight: 600, mb: 1, lineHeight: 1.3 }}
            >
              {isGuest ? item.name : product.name}
            </Typography>

            <Typography
              variant="h6"
              color="primary"
              sx={{ fontWeight: 700, mb: 2 }}
            >
              ${isGuest ? item.price : product.price}
            </Typography>

            {/* Quantity Controls */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mt: 'auto' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <IconButton
                  size="small"
                  onClick={() =>
                    isGuest ? subtractGuestItem(item) : subtractItem(item)
                  }
                  disabled={quantity <= 1}
                  sx={{
                    backgroundColor: 'grey.100',
                    '&:hover': { backgroundColor: 'grey.200' },
                  }}
                >
                  <Remove fontSize="small" />
                </IconButton>

                <Chip
                  label={quantity}
                  sx={{
                    minWidth: 40,
                    fontWeight: 600,
                    backgroundColor: 'grey.100',
                  }}
                />

                <IconButton
                  size="small"
                  onClick={() => (isGuest ? addGuestItem(item) : addItem(item))}
                  sx={{
                    backgroundColor: 'grey.100',
                    '&:hover': { backgroundColor: 'grey.200' },
                  }}
                >
                  <Add fontSize="small" />
                </IconButton>
              </Box>

              <Typography variant="body2" color="text.secondary" sx={{ mx: 2 }}>
                Total: ${((isGuest ? item.price : product.price) * quantity).toFixed(2)}
              </Typography>

              <IconButton
                color="error"
                onClick={() =>
                  isGuest ? deleteGuestItem(item) : deleteItem(item)
                }
                sx={{
                  ml: 'auto',
                  '&:hover': { backgroundColor: 'error.light', color: 'white' },
                }}
              >
                <Delete />
              </IconButton>
            </Box>
          </Box>
        </Box>
      </Card>
    );
  };

  if (isLoading) {
    return (
      <Container maxWidth="md" sx={{ py: 8, textAlign: 'center' }}>
        <Typography variant="h5" sx={{ mb: 2 }}>
          Transferring your cart...
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Please wait while we sync your items.
        </Typography>
      </Container>
    );
  }

  const cartItems = getCartItems();
  const total = calculateTotal();
  const isEmpty = !cartItems || cartItems.length === 0;

  return (
    <Box sx={{ backgroundColor: 'background.default', minHeight: '100vh' }}>
      <Container maxWidth="md" sx={{ py: 4 }}>
        {/* Breadcrumbs */}
        <Breadcrumbs sx={{ mb: 4 }}>
          <MuiLink
            component={Link}
            to="/home"
            sx={{ display: 'flex', alignItems: 'center', textDecoration: 'none' }}
          >
            <Home sx={{ mr: 0.5, fontSize: 20 }} />
            Home
          </MuiLink>
          <MuiLink
            component={Link}
            to="/products"
            sx={{ display: 'flex', alignItems: 'center', textDecoration: 'none' }}
          >
            <Storefront sx={{ mr: 0.5, fontSize: 20 }} />
            Products
          </MuiLink>
          <Typography color="text.primary">Cart</Typography>
        </Breadcrumbs>

        {/* Header */}
        <Box sx={{ textAlign: 'center', mb: 4 }}>
          <Typography
            variant="h3"
            component="h1"
            sx={{
              fontWeight: 700,
              color: 'text.primary',
              mb: 2,
            }}
          >
            Your Cart
          </Typography>
          {!isEmpty && (
            <Typography variant="h6" color="text.secondary">
              {cartItems.length} item{cartItems.length !== 1 ? 's' : ''} in your cart
            </Typography>
          )}
        </Box>

        {isEmpty ? (
          /* Empty Cart */
          <Fade in={true}>
            <Card sx={{ textAlign: 'center', py: 8 }}>
              <ShoppingBag
                sx={{
                  fontSize: 80,
                  color: 'grey.400',
                  mb: 3,
                }}
              />
              <Typography variant="h5" sx={{ mb: 2, fontWeight: 600 }}>
                Your cart is empty
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
                Looks like you haven't added any fishing wisdom to your cart yet!
              </Typography>
              <Button
                component={Link}
                to="/products"
                variant="contained"
                size="large"
                endIcon={<ArrowForward />}
                sx={{
                  borderRadius: 2,
                  px: 4,
                  py: 1.5,
                  textTransform: 'none',
                  fontWeight: 600,
                }}
              >
                Shop Products
              </Button>
            </Card>
          </Fade>
        ) : (
          <Grid container spacing={4}>
            {/* Cart Items */}
            <Grid item xs={12} md={8}>
              <Box>
                {cartItems.map((item, index) => (
                  <Fade key={isLoggedIn ? item.product?.id : item.productId} in={true} timeout={300 + index * 100}>
                    <div>
                      <CartItem item={item} isGuest={!isLoggedIn} />
                    </div>
                  </Fade>
                ))}
              </Box>
            </Grid>

            {/* Order Summary */}
            <Grid item xs={12} md={4}>
              <Card sx={{ p: 3, position: 'sticky', top: 24 }}>
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>
                  Order Summary
                </Typography>

                <Box sx={{ mb: 3 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography>Subtotal</Typography>
                    <Typography>${total.toFixed(2)}</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography>Shipping</Typography>
                    <Typography color="success.main">Free</Typography>
                  </Box>
                  <Divider sx={{ my: 2 }} />
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
                    <Typography variant="h6" fontWeight={600}>
                      Total
                    </Typography>
                    <Typography variant="h6" fontWeight={600}>
                      ${total.toFixed(2)}
                    </Typography>
                  </Box>
                </Box>

                {isLoggedIn ? (
                  <Button
                    variant="contained"
                    size="large"
                    fullWidth
                    onClick={() => checkoutOrder(openOrder.id)}
                    sx={{
                      borderRadius: 2,
                      py: 1.5,
                      textTransform: 'none',
                      fontWeight: 600,
                      mb: 2,
                    }}
                  >
                    Checkout with Stripe
                  </Button>
                ) : (
                  <Button
                    component={Link}
                    to="/login"
                    variant="contained"
                    size="large"
                    fullWidth
                    sx={{
                      borderRadius: 2,
                      py: 1.5,
                      textTransform: 'none',
                      fontWeight: 600,
                      mb: 2,
                    }}
                  >
                    Login to Checkout
                  </Button>
                )}

                {/* Features */}
                <Box sx={{ mt: 3, pt: 3, borderTop: '1px solid', borderColor: 'grey.200' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <LocalShipping sx={{ color: 'success.main', mr: 1, fontSize: 20 }} />
                    <Typography variant="body2" color="text.secondary">
                      Free shipping on all orders
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Security sx={{ color: 'success.main', mr: 1, fontSize: 20 }} />
                    <Typography variant="body2" color="text.secondary">
                      Secure checkout guaranteed
                    </Typography>
                  </Box>
                </Box>
              </Card>
            </Grid>
          </Grid>
        )}
      </Container>
      <Toaster position="bottom-right" />
    </Box>
  );
};

const mapState = (state) => ({
  openOrder: state.order,
  user: state.user,
});

export default connect(mapState)(ModernCart);