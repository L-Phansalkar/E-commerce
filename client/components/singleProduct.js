// Update your SingleProduct.js component with thermal vision styling
// Replace the button text and add thermal styling

import React, {Component} from 'react';
import {connect} from 'react-redux';
import {getProduct} from '../store/singleProduct';
import {subtractProductInv} from '../store/singleProduct';
import {updateCurrOrder} from '../store/productOrders';
import {getCurrOrder} from '../store/orders';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import toast, {Toaster} from 'react-hot-toast';

class SingleProduct extends Component {
  componentDidMount() {
    this.props.getProduct(this.props.match.params.id);
    this.props.getOrder();
  }

  updateInventory() {
    if (this.props.id) {
      this.props.subtractInventory(this.props.singleProduct.id);
      this.props.updateOrder(
        this.props.singleProduct.id,
        this.props.openOrder.id
      );
    } else {
      //handle guest users
      let cart = JSON.parse(localStorage.getItem('cart'));
      if (cart) {
        let currentItem = cart.find(
          (item) => item.productId === this.props.singleProduct.id
        );
        if (currentItem) {
          currentItem.quantity++;
          localStorage.setItem('cart', JSON.stringify(cart));
        } else {
          cart.push({
            productId: this.props.singleProduct.id,
            name: this.props.singleProduct.name,
            quantity: 1,
            price: this.props.singleProduct.price,
            image: this.props.singleProduct.image,
          });
          localStorage.setItem('cart', JSON.stringify(cart));
        }
      } else {
        localStorage.setItem(
          'cart',
          JSON.stringify([
            {
              productId: this.props.singleProduct.id,
              name: this.props.singleProduct.name,
              quantity: 1,
              price: this.props.singleProduct.price,
              image: this.props.singleProduct.image,
            },
          ])
        );
      }
      console.log(localStorage.getItem('cart'));
    }
    // Updated success message for thermal theme
    toast.success('Added to Reality! 🔥', {
      style: {
        background: 'linear-gradient(45deg, #00ff40, #00ffff)',
        color: '#0a0020',
        fontFamily: 'Orbitron, monospace',
        fontWeight: 'bold',
        textTransform: 'uppercase',
        letterSpacing: '2px',
      },
    });
  }

  render() {
    const product = this.props.singleProduct;
    return (
      <div id="singleProduct">
        <Paper sx={{
          p: 2, 
          margin: 'auto', 
          flexGrow: 1, 
          bgcolor: 'background.paper',
          background: 'rgba(10, 0, 32, 0.8)',
          border: '2px solid #ff0040',
          borderRadius: '15px',
          backdropFilter: 'blur(10px)',
          boxShadow: '0 0 20px #ff6600',
          mt: 4
        }}>
          <Grid container spacing={1}>
            <Grid item>
              <CardMedia
                sx={{
                  width: 500,
                  height: 500,
                  margin: 2,
                  borderRadius: '8px',
                  border: '2px solid #ff0040',
                  filter: 'contrast(1.3) saturate(1.3) hue-rotate(10deg) brightness(1.1)',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    filter: 'contrast(1.4) saturate(1.5) hue-rotate(30deg) brightness(1.2)',
                    transform: 'scale(1.02)',
                  }
                }}
                image={product.image}
                title={product.name}
              />
            </Grid>
            <Grid item xs={12} sm container>
              <Grid item xs container direction="column" spacing={2}>
                <Grid item xs>
                  <Typography 
                    gutterBottom 
                    variant="subtitle1" 
                    component="div"
                    sx={{
                      fontFamily: 'Orbitron, monospace',
                      color: '#00ffff',
                      textTransform: 'uppercase',
                      letterSpacing: '2px',
                      textShadow: '0 0 15px #00ff40',
                      fontSize: '2rem',
                      fontWeight: 'bold'
                    }}
                  >
                    {product.name}
                  </Typography>
                  
                  <Typography 
                    variant="body1" 
                    sx={{
                      fontFamily: 'VT323, monospace',
                      color: '#ffff00',
                      fontSize: '1.3rem',
                      mb: 2,
                      lineHeight: 1.4
                    }}
                  >
                    {product.description}
                  </Typography>
                  
                  <br />
                  
                  <Typography 
                    variant="body1"
                    sx={{
                      fontFamily: 'VT323, monospace',
                      color: '#ffff00',
                      fontSize: '1.2rem'
                    }}
                  >
                    Meme Energy: {product.songs}
                  </Typography>
                  
                  <Typography 
                    variant="body1"
                    sx={{
                      fontFamily: 'VT323, monospace',
                      color: '#ffff00',
                      fontSize: '1.2rem'
                    }}
                  >
                    Year Manifested: {product.year}
                  </Typography>
                  
                  <br />
                  
                  <Typography 
                    variant="body2" 
                    color="text.secondary"
                    sx={{
                      fontFamily: 'VT323, monospace',
                      color: '#00ffff',
                      fontSize: '1.1rem'
                    }}
                  >
                    In stock: {product.inventory}
                  </Typography>
                  
                  <Typography 
                    variant="h4" 
                    component="div"
                    sx={{
                      fontFamily: 'Press Start 2P, monospace',
                      background: 'linear-gradient(45deg, #ff6600, #ff0040)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      backgroundClip: 'text',
                      fontSize: '1.8rem',
                      mt: 2,
                      mb: 2,
                      animation: 'thermalPriceGlow 2s ease-in-out infinite alternate'
                    }}
                  >
                    ${product.price}
                  </Typography>
                </Grid>
                
                {product.inventory > 0 ? (
                  <Grid item>
                    <Typography sx={{cursor: 'pointer'}} variant="body2">
                      <Button 
                        variant="contained" 
                        onClick={() => this.updateInventory()}
                        sx={{
                          background: 'linear-gradient(45deg, #ff0040, #ff6600)',
                          color: 'white',
                          fontFamily: 'Orbitron, monospace',
                          fontWeight: 700,
                          textTransform: 'uppercase',
                          letterSpacing: '2px',
                          fontSize: '1.1rem',
                          px: 4,
                          py: 2,
                          borderRadius: '8px',
                          boxShadow: '0 0 20px #ff0040',
                          border: 'none',
                          transition: 'all 0.3s ease',
                          position: 'relative',
                          overflow: 'hidden',
                          '&:hover': {
                            background: 'linear-gradient(45deg, #ff6600, #ffff00)',
                            transform: 'translateY(-2px)',
                            boxShadow: '0 10px 30px #ff6600',
                          },
                          '&::before': {
                            content: '""',
                            position: 'absolute',
                            top: 0,
                            left: '-100%',
                            width: '100%',
                            height: '100%',
                            background: 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.4), transparent)',
                            transition: 'left 0.5s ease',
                          },
                          '&:hover::before': {
                            left: '100%',
                          }
                        }}
                      >
                        ADD TO REALITY
                      </Button>
                    </Typography>
                  </Grid>
                ) : (
                  <Typography 
                    variant="h4"
                    sx={{
                      fontFamily: 'Press Start 2P, monospace',
                      color: '#ff0040',
                      textTransform: 'uppercase',
                      letterSpacing: '2px',
                      fontSize: '1.2rem',
                      textShadow: '0 0 10px #ff0040',
                      animation: 'glitchText 1s ease-in-out infinite'
                    }}
                  >
                    OUT OF STOCK
                  </Typography>
                )}
              </Grid>
            </Grid>
          </Grid>
        </Paper>
        <Toaster position="top-center" />
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    singleProduct: state.product,
    id: state.user.id,
    openOrder: state.order,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    getProduct: (id) => dispatch(getProduct(id)),
    subtractInventory: (id) => dispatch(subtractProductInv(id)),
    updateOrder: (productId, orderId) =>
      dispatch(updateCurrOrder(productId, orderId)),
    getOrder: () => dispatch(getCurrOrder()),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(SingleProduct);
