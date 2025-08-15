import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { getOneProduct } from '../store/singleProduct';
import { useCart } from '../hooks/useCart';
import { Button } from '@mui/material';
import { styled } from '@mui/material/styles';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import ButtonBase from '@mui/material/ButtonBase';
import { Toaster } from 'react-hot-toast';

const Img = styled('img')({
  margin: 'auto',
  display: 'block',
  width: 500,
});

const SingleProductFunctional = () => {
  const { id: productId } = useParams();
  const dispatch = useDispatch();
  const singleProduct = useSelector(state => state.product);
  const { addToCart } = useCart();

  useEffect(() => {
    if (productId) {
      dispatch(getOneProduct(productId));
    }
  }, [dispatch, productId]);

  const handleAddToCart = async () => {
    if (singleProduct && singleProduct.id) {
      await addToCart(singleProduct);
    }
  };

  if (!singleProduct || !singleProduct.id) {
    return (
      <div style={{ textAlign: 'center', padding: '20px' }}>
        <Typography variant="h6">Loading product...</Typography>
      </div>
    );
  }

  return (
    <div id="singleProduct">
      <Paper
        sx={{
          p: 2,
          margin: 'auto',
          flexGrow: 1,
          bgcolor: 'background.paper',
        }}
      >
        <Grid container spacing={1}>
          <Grid item>
            <ButtonBase sx={{ width: 500, height: 500, margin: 2 }}>
              <Img alt={singleProduct.name} src={singleProduct.image} />
            </ButtonBase>
          </Grid>
          <Grid item xs={12} sm container>
            <Grid item xs container direction="column" spacing={2}>
              <Grid item xs>
                <Typography gutterBottom variant="subtitle1" component="div">
                  <h2>{singleProduct.name}</h2>
                </Typography>
                <Typography variant="subtitle1" component="div">
                  {singleProduct.description}
                </Typography>
                <br />
                <Typography variant="subtitle1" component="div">
                  Songs: {singleProduct.songs}
                </Typography>
                <Typography variant="subtitle1" component="div">
                  Year Created: {singleProduct.year}
                </Typography>
                <br />
                <Typography variant="body2" color="text.secondary">
                  In stock: {singleProduct.inventory}
                </Typography>
                <Typography variant="subtitle1" component="div">
                  ${singleProduct.price}
                </Typography>
              </Grid>
              {singleProduct.inventory > 0 ? (
                <Grid item>
                  <Button
                    variant="contained"
                    onClick={handleAddToCart}
                    size="large"
                  >
                    ADD TO CART
                  </Button>
                </Grid>
              ) : (
                <Grid item>
                  <Typography variant="h6" color="error">
                    OUT OF STOCK
                  </Typography>
                </Grid>
              )}
            </Grid>
            <Grid item />
          </Grid>
        </Grid>
      </Paper>
      <Toaster />
    </div>
  );
};

export default SingleProductFunctional;
