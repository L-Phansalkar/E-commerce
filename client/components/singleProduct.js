import React from 'react';
import { connect } from 'react-redux';
import { getOneProduct, subtractProductInv } from '../store/singleProduct';
import { getCurrOrder } from '../store/orders';
import { updateCurrOrder } from '../store/productOrders';
import {
  Box,
  Container,
  Grid,
  Typography,
  Button,
  Chip,
  Card,
  CardMedia,
  Breadcrumbs,
  Link,
  Divider,
  Fade,
  Skeleton,
} from '@mui/material';
import {
  AddShoppingCart,
  Inventory,
  AttachMoney,
  Home,
  Storefront,
  Star,
  LocalShipping,
  Security,
  Replay,
} from '@mui/icons-material';
import { Link as RouterLink } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';

export class ModernSingleProduct extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      imageLoaded: false,
      quantity: 1,
    };
    this.updateInventory = this.updateInventory.bind(this);
  }

  productId = window.location.href.split('/')[4];

  componentDidMount() {
    this.props.getProduct(this.productId);
    if (this.props.user.id) {
      this.props.getOpenOrder();
    }
  }

  async updateInventory() {
    const user_id = this.props.user.id;

    if (user_id) {
      try {
        await this.props.getOpenOrder();
        await this.props.updateProductInventory(this.productId);
        await this.props.updateCurrentOrder(this.productId, this.props.openOrder.id);
        toast.success('Added to cart!', {
          style: {
            background: '#10b981',
            color: 'white',
          },
        });
      } catch (error) {
        console.error('Error adding to cart:', error);
        toast.error('Failed to add item to cart');
      }
    } else {
      try {
        const existing = JSON.parse(localStorage.getItem('cart')) || [];
        const productToAdd = {
          productId: this.props.singleProduct.id,
          name: this.props.singleProduct.name,
          quantity: 1,
          price: this.props.singleProduct.price,
          image: this.props.singleProduct.image,
        };

        const existingItemIndex = existing.findIndex(
          (item) => item.productId === productToAdd.productId
        );

        if (existingItemIndex !== -1) {
          existing[existingItemIndex].quantity++;
        } else {
          existing.push(productToAdd);
        }

        localStorage.setItem('cart', JSON.stringify(existing));
        toast.success('Added to cart!', {
          style: {
            background: '#10b981',
            color: 'white',
          },
        });
      } catch (error) {
        console.error('Error adding to localStorage cart:', error);
        toast.error('Failed to add item to cart');
      }
    }
  }

  render() {
    const { singleProduct, user } = this.props;
    const { imageLoaded } = this.state;

    if (!singleProduct || !singleProduct.id) {
      return (
        <Container maxWidth="lg" sx={{ py: 4 }}>
          <Grid container spacing={4}>
            <Grid item xs={12} md={6}>
              <Skeleton variant="rectangular" height={500} sx={{ borderRadius: 2 }} />
            </Grid>
            <Grid item xs={12} md={6}>
              <Skeleton variant="text" height={60} />
              <Skeleton variant="text" height={40} width="60%" />
              <Skeleton variant="text" height={120} />
              <Skeleton variant="rectangular" height={56} sx={{ mt: 3, borderRadius: 2 }} />
            </Grid>
          </Grid>
        </Container>
      );
    }

    return (
      <Box sx={{ backgroundColor: 'background.default', minHeight: '100vh' }}>
        <Container maxWidth="lg" sx={{ py: 4 }}>
          {/* Breadcrumbs */}
          <Breadcrumbs sx={{ mb: 4 }}>
            <Link
              component={RouterLink}
              to="/home"
              sx={{ display: 'flex', alignItems: 'center', textDecoration: 'none' }}
            >
              <Home sx={{ mr: 0.5, fontSize: 20 }} />
              Home
            </Link>
            <Link
              component={RouterLink}
              to="/products"
              sx={{ display: 'flex', alignItems: 'center', textDecoration: 'none' }}
            >
              <Storefront sx={{ mr: 0.5, fontSize: 20 }} />
              Products
            </Link>
            <Typography color="text.primary">{singleProduct.name}</Typography>
          </Breadcrumbs>

          <Grid container spacing={6}>
            {/* Product Image */}
            <Grid item xs={12} md={6}>
              <Fade in={true} timeout={500}>
                <Card
                  sx={{
                    borderRadius: 3,
                    overflow: 'hidden',
                    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
                  }}
                >
                  {!imageLoaded && (
                    <Skeleton variant="rectangular" height={500} />
                  )}
                  <CardMedia
                    component="img"
                    image={singleProduct.image}
                    alt={singleProduct.name}
                    onLoad={() => this.setState({ imageLoaded: true })}
                    sx={{
                      width: '100%',
                      height: 'auto',
                      aspectRatio: '1/1',
                      objectFit: 'cover',
                      display: imageLoaded ? 'block' : 'none',
                    }}
                  />
                </Card>
              </Fade>
            </Grid>

            {/* Product Details */}
            <Grid item xs={12} md={6}>
              <Fade in={true} timeout={700}>
                <Box>
                  {/* Stock Status */}
                  <Chip
                    icon={<Inventory />}
                    label={singleProduct.inventory > 0 ? `${singleProduct.inventory} in stock` : 'Out of stock'}
                    color={singleProduct.inventory > 0 ? 'success' : 'error'}
                    sx={{ mb: 2 }}
                  />

                  {/* Product Title */}
                  <Typography
                    variant="h3"
                    component="h1"
                    sx={{
                      fontWeight: 700,
                      color: 'text.primary',
                      mb: 2,
                      lineHeight: 1.2,
                    }}
                  >
                    {singleProduct.name}
                  </Typography>

                  {/* Price */}
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                    <AttachMoney sx={{ color: 'secondary.main', fontSize: 32 }} />
                    <Typography
                      variant="h4"
                      sx={{
                        fontWeight: 700,
                        color: 'text.primary',
                        ml: 0.5,
                      }}
                    >
                      {singleProduct.price}
                    </Typography>
                  </Box>

                  {/* Description */}
                  {singleProduct.description && (
                    <Box sx={{ mb: 4 }}>
                      <Typography
                        variant="body1"
                        color="text.secondary"
                        sx={{ lineHeight: 1.6, mb: 2 }}
                      >
                        {singleProduct.description}
                      </Typography>
                    </Box>
                  )}

                  {/* Product Details */}
                  <Box sx={{ mb: 4 }}>
                    <Grid container spacing={2}>
                      {singleProduct.songs && (
                        <Grid item xs={6}>
                          <Typography variant="body2" color="text.secondary">
                            Songs
                          </Typography>
                          <Typography variant="body1" fontWeight={500}>
                            {singleProduct.songs}
                          </Typography>
                        </Grid>
                      )}
                      {singleProduct.year && (
                        <Grid item xs={6}>
                          <Typography variant="body2" color="text.secondary">
                            Year Created
                          </Typography>
                          <Typography variant="body1" fontWeight={500}>
                            {singleProduct.year}
                          </Typography>
                        </Grid>
                      )}
                    </Grid>
                  </Box>

                  <Divider sx={{ mb: 4 }} />

                  {/* Add to Cart Section */}
                  <Box sx={{ mb: 4 }}>
                    {singleProduct.inventory > 0 ? (
                      <Button
                        variant="contained"
                        size="large"
                        startIcon={<AddShoppingCart />}
                        onClick={this.updateInventory}
                        sx={{
                          width: '100%',
                          py: 2,
                          fontSize: '1.1rem',
                          fontWeight: 600,
                          borderRadius: 2,
                          textTransform: 'none',
                          backgroundColor: 'primary.main',
                          '&:hover': {
                            backgroundColor: 'primary.dark',
                            transform: 'translateY(-2px)',
                            boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.2)',
                          },
                          transition: 'all 0.2s ease-in-out',
                        }}
                      >
                        Add to Cart
                      </Button>
                    ) : (
                      <Button
                        variant="outlined"
                        size="large"
                        disabled
                        sx={{
                          width: '100%',
                          py: 2,
                          fontSize: '1.1rem',
                          fontWeight: 600,
                          borderRadius: 2,
                          textTransform: 'none',
                        }}
                      >
                        Out of Stock
                      </Button>
                    )}
                  </Box>

                  {/* Features */}
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <LocalShipping sx={{ color: 'secondary.main', mr: 2 }} />
                      <Typography variant="body2" color="text.secondary">
                        Free shipping on orders over $50
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Security sx={{ color: 'secondary.main', mr: 2 }} />
                      <Typography variant="body2" color="text.secondary">
                        Secure checkout guaranteed
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Replay sx={{ color: 'secondary.main', mr: 2 }} />
                      <Typography variant="body2" color="text.secondary">
                        30-day return policy
                      </Typography>
                    </Box>
                  </Box>
                </Box>
              </Fade>
            </Grid>
          </Grid>

          {/* Additional Product Information */}
          <Box sx={{ mt: 8 }}>
            <Typography
              variant="h5"
              component="h2"
              sx={{ fontWeight: 600, mb: 3, textAlign: 'center' }}
            >
              Why Choose Our Fishing Apparel?
            </Typography>
            <Grid container spacing={4}>
              <Grid item xs={12} md={4}>
                <Box sx={{ textAlign: 'center', p: 3 }}>
                  <Star sx={{ fontSize: 48, color: 'secondary.main', mb: 2 }} />
                  <Typography variant="h6" fontWeight={600} sx={{ mb: 1 }}>
                    Premium Quality
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    High-quality materials that last through countless fishing adventures
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} md={4}>
                <Box sx={{ textAlign: 'center', p: 3 }}>
                  <Storefront sx={{ fontSize: 48, color: 'secondary.main', mb: 2 }} />
                  <Typography variant="h6" fontWeight={600} sx={{ mb: 1 }}>
                    Unique Designs
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Exclusive fishing-themed designs you won't find anywhere else
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} md={4}>
                <Box sx={{ textAlign: 'center', p: 3 }}>
                  <LocalShipping sx={{ fontSize: 48, color: 'secondary.main', mb: 2 }} />
                  <Typography variant="h6" fontWeight={600} sx={{ mb: 1 }}>
                    Fast Shipping
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Quick delivery so you can start wearing your fishing pride
                  </Typography>
                </Box>
              </Grid>
            </Grid>
          </Box>
        </Container>
        <Toaster position="bottom-right" />
      </Box>
    );
  }
}

const mapState = (state) => ({
  singleProduct: state.product,
  user: state.user,
  openOrder: state.order,
});

const mapDispatch = (dispatch) => ({
  getProduct: (id) => dispatch(getOneProduct(id)),
  updateProductInventory: (id) => dispatch(subtractProductInv(id)),
  updateCurrentOrder: (productId, openOrderId) =>
    dispatch(updateCurrOrder(productId, openOrderId)),
  getOpenOrder: () => dispatch(getCurrOrder()),
});

export default connect(mapState, mapDispatch)(ModernSingleProduct);
