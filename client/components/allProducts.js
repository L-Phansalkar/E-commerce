import React from 'react';
import { connect } from 'react-redux';
import { getAllProducts } from '../store/products';
import { Link } from 'react-router-dom';
import {
  Grid,
  Card,
  CardMedia,
  CardContent,
  Typography,
  Box,
  Container,
  Chip,
  Button,
  Fade,
} from '@mui/material';
import { Storefront, AttachMoney } from '@mui/icons-material';

export class ModernAllProducts extends React.Component {
  componentDidMount() {
    this.props.getProducts();
  }

  render() {
    const { products } = this.props;

    return (
      <Box
        sx={{
          backgroundColor: 'background.default',
          minHeight: '100vh',
          py: 6,
        }}
      >
        <Container maxWidth="xl">
          {/* Header Section */}
          <Box sx={{ textAlign: 'center', mb: 8 }}>
            <Typography
              variant="h2"
              component="h1"
              sx={{
                fontWeight: 700,
                color: 'text.primary',
                mb: 2,
                background: 'linear-gradient(45deg, #1a1a1a 30%, #2563eb 90%)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              Fishing Wisdom Collection
            </Typography>
            <Typography
              variant="h6"
              color="text.secondary"
              sx={{ maxWidth: 600, mx: 'auto', lineHeight: 1.6 }}
            >
              Premium fishing-themed apparel that speaks to the soul of every angler.
              Wear your passion with pride.
            </Typography>
          </Box>

          {/* Products Grid */}
          <Grid container spacing={4}>
            {products.map((product, index) => (
              <Grid item xs={12} sm={6} md={4} lg={3} key={product.id}>
                <Fade in={true} timeout={300 + index * 100}>
                  <Card
                    sx={{
                      height: '100%',
                      display: 'flex',
                      flexDirection: 'column',
                      transition: 'all 0.3s ease-in-out',
                      cursor: 'pointer',
                      '&:hover': {
                        transform: 'translateY(-8px)',
                        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
                      },
                    }}
                    component={Link}
                    to={`/products/${product.id}`}
                    style={{ textDecoration: 'none', color: 'inherit' }}
                  >
                    {/* Product Image */}
                    <Box
                      sx={{
                        position: 'relative',
                        pt: '100%', // 1:1 Aspect Ratio
                        overflow: 'hidden',
                        backgroundColor: 'grey.50',
                      }}
                    >
                      <CardMedia
                        component="img"
                        image={product.image}
                        alt={product.name}
                        sx={{
                          position: 'absolute',
                          top: 0,
                          left: 0,
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover',
                          transition: 'transform 0.3s ease-in-out',
                          '&:hover': {
                            transform: 'scale(1.05)',
                          },
                        }}
                      />
                      
                      {/* Stock Status Chip */}
                      <Chip
                        label={product.inventory > 0 ? 'In Stock' : 'Out of Stock'}
                        size="small"
                        color={product.inventory > 0 ? 'success' : 'error'}
                        sx={{
                          position: 'absolute',
                          top: 12,
                          right: 12,
                          backgroundColor: product.inventory > 0 ? '#10b981' : '#ef4444',
                          color: 'white',
                          fontWeight: 600,
                        }}
                      />
                    </Box>

                    {/* Product Info */}
                    <CardContent
                      sx={{
                        flexGrow: 1,
                        display: 'flex',
                        flexDirection: 'column',
                        p: 3,
                      }}
                    >
                      <Typography
                        variant="h6"
                        component="h3"
                        sx={{
                          fontWeight: 600,
                          color: 'text.primary',
                          mb: 2,
                          lineHeight: 1.3,
                          display: '-webkit-box',
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: 'vertical',
                          overflow: 'hidden',
                        }}
                      >
                        {product.name}
                      </Typography>

                      {/* Price */}
                      <Box
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          mt: 'auto',
                          pt: 2,
                        }}
                      >
                        <AttachMoney
                          sx={{ color: 'secondary.main', fontSize: 20 }}
                        />
                        <Typography
                          variant="h6"
                          sx={{
                            fontWeight: 700,
                            color: 'text.primary',
                            ml: 0.5,
                          }}
                        >
                          {product.price}
                        </Typography>
                      </Box>

                      {/* Quick View Button */}
                      <Button
                        variant="outlined"
                        size="small"
                        sx={{
                          mt: 2,
                          borderRadius: 2,
                          textTransform: 'none',
                          fontWeight: 500,
                        }}
                        onClick={(e) => {
                          e.preventDefault(); // Prevent card link navigation
                          // Quick view logic here
                        }}
                      >
                        Quick View
                      </Button>
                    </CardContent>
                  </Card>
                </Fade>
              </Grid>
            ))}
          </Grid>

          {/* Empty State */}
          {products.length === 0 && (
            <Box
              sx={{
                textAlign: 'center',
                py: 8,
              }}
            >
              <Storefront
                sx={{
                  fontSize: 80,
                  color: 'grey.400',
                  mb: 2,
                }}
              />
              <Typography
                variant="h5"
                color="text.secondary"
                sx={{ mb: 1 }}
              >
                No products available
              </Typography>
              <Typography color="text.secondary">
                Check back soon for new fishing wisdom!
              </Typography>
            </Box>
          )}
        </Container>
      </Box>
    );
  }
}

const mapState = (state) => ({
  products: state.products,
});

const mapDispatch = (dispatch) => ({
  getProducts: () => dispatch(getAllProducts()),
});

export default connect(mapState, mapDispatch)(ModernAllProducts);
