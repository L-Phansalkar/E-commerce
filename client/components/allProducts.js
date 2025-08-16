import React from 'react';
import {connect} from 'react-redux';
import {getAllProducts} from '../store/products';
import {Link} from 'react-router-dom';
import {
  Grid,
  Card,
  CardMedia,
  CardContent,
  CardActions,
  Typography,
  Button,
  Chip,
  Box
} from '@mui/material';

export class AllProducts extends React.Component {
  componentDidMount() {
    this.props.getProducts();
  }

  render() {
    const {products} = this.props;

    return (
      <div id="allProducts">
        <div className="outerContainer">
          {/* Products Grid */}
          <Grid container spacing={4} sx={{ p: 2 }}>
            {products.map((product) => (
              <Grid item xs={12} sm={6} md={4} lg={3} key={product.id}>
                <Card className="product-card" sx={{ position: 'relative', height: '100%', display: 'flex', flexDirection: 'column' }}>
                  <Chip
                    label="CLASSIC"
                    className="vaporwave-badge"
                    sx={{
                      position: 'absolute',
                      top: 15,
                      right: 15,
                      background: 'linear-gradient(45deg, #00ff40, #00ffff)',
                      color: '#0a0020',
                      fontFamily: 'VT323, monospace',
                      fontWeight: 'bold',
                      textTransform: 'uppercase',
                      zIndex: 10
                    }}
                  />
                  
                  <CardMedia
                    component="img"
                    height="250"
                    image={product.image}
                    alt={product.name}
                    sx={{
                      objectFit: 'cover',
                      '&:hover': {
                        transform: 'scale(1.05)',
                        transition: 'transform 0.3s ease-in-out'
                      }
                    }}
                  />
                  
                  <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                    <Typography 
                      gutterBottom 
                      variant="h6" 
                      component="h3"
                      sx={{ 
                        fontFamily: 'VT323, monospace',
                        fontSize: '1.2rem',
                        color: '#00ff40',
                        textShadow: '0 0 10px #00ff40',
                        minHeight: '2.4rem',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical'
                      }}
                    >
                      <Link 
                        to={`/products/${product.id}`} 
                        style={{ 
                          textDecoration: 'none', 
                          color: 'inherit',
                          '&:hover': {
                            textShadow: '0 0 15px #00ff40'
                          }
                        }}
                      >
                        {product.name}
                      </Link>
                    </Typography>
                    
                    <Typography 
                      variant="body2" 
                      color="text.secondary" 
                      sx={{ 
                        mb: 2,
                        flexGrow: 1,
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        display: '-webkit-box',
                        WebkitLineClamp: 3,
                        WebkitBoxOrient: 'vertical'
                      }}
                    >
                      {product.description}
                    </Typography>

                    <Box sx={{ mt: 'auto' }}>
                      {product.year && (
                        <Typography 
                          variant="body2" 
                          sx={{ 
                            color: '#00ffff',
                            fontFamily: 'VT323, monospace',
                            fontSize: '0.9rem'
                          }}
                        >
                          Year: {product.year}
                        </Typography>
                      )}
                      
                      {product.songs && (
                        <Typography 
                          variant="body2" 
                          sx={{ 
                            color: '#ff00ff',
                            fontFamily: 'VT323, monospace',
                            fontSize: '0.9rem',
                            mb: 1,
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap'
                          }}
                        >
                          Songs: {product.songs}
                        </Typography>
                      )}

                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 2 }}>
                        <Typography 
                          variant="h6" 
                          sx={{ 
                            color: '#00ff40',
                            fontFamily: 'VT323, monospace',
                            fontSize: '1.4rem',
                            textShadow: '0 0 10px #00ff40'
                          }}
                        >
                          ${product.price}
                        </Typography>
                        
                        <Chip
                          label={product.inventory > 0 ? `${product.inventory} in stock` : 'OUT OF STOCK'}
                          size="small"
                          sx={{
                            backgroundColor: product.inventory > 0 ? '#00ff40' : '#ff0040',
                            color: '#0a0020',
                            fontFamily: 'VT323, monospace',
                            fontWeight: 'bold'
                          }}
                        />
                      </Box>
                    </Box>
                  </CardContent>
                  
                  <CardActions sx={{ p: 2, pt: 0 }}>
                    <Button
                      fullWidth
                      variant="contained"
                      disabled={product.inventory === 0}
                      component={Link}
                      to={`/products/${product.id}`}
                      sx={{
                        background: product.inventory > 0 
                          ? 'linear-gradient(45deg, #ff00ff, #00ffff)' 
                          : 'linear-gradient(45deg, #666, #333)',
                        color: '#0a0020',
                        fontFamily: 'VT323, monospace',
                        fontWeight: 'bold',
                        fontSize: '1rem',
                        textTransform: 'uppercase',
                        textDecoration: 'none',
                        boxShadow: product.inventory > 0 ? '0 0 20px rgba(255, 0, 255, 0.5)' : 'none',
                        '&:hover': {
                          background: product.inventory > 0 
                            ? 'linear-gradient(45deg, #ff40ff, #40ffff)' 
                            : 'linear-gradient(45deg, #666, #333)',
                          transform: product.inventory > 0 ? 'translateY(-2px)' : 'none',
                          boxShadow: product.inventory > 0 ? '0 4px 25px rgba(255, 0, 255, 0.7)' : 'none',
                          textDecoration: 'none'
                        },
                        '&:disabled': {
                          background: 'linear-gradient(45deg, #666, #333)',
                          color: '#999'
                        }
                      }}
                    >
                      {product.inventory > 0 ? 'View Details' : 'Sold Out'}
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>
        </div>
      </div>
    );
  }
}

const mapState = (state) => {
  return {
    products: state.products,
  };
};

const mapDispatch = (dispatch) => {
  return {
    getProducts: () => dispatch(getAllProducts()),
  };
};

export default connect(mapState, mapDispatch)(AllProducts);
