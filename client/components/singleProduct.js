import React from 'react';
import {connect} from 'react-redux';
import {getOneProduct, subtractProductInv} from '../store/singleProduct';
import {getCurrOrder} from '../store/orders';
import {updateCurrOrder} from '../store/productOrders';
import {Button} from '@mui/material';
import {styled} from '@mui/material/styles';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import ButtonBase from '@mui/material/ButtonBase';
import toast, {Toaster} from 'react-hot-toast';

const Img = styled('img')({
  margin: 'auto',
  display: 'block',
  width: 500,
});

export class SingleProduct extends React.Component {
  constructor(props) {
    super(props);
    this.updateInventory = this.updateInventory.bind(this);
  }

  productId = window.location.href.split('/')[4];
  componentDidMount() {
    this.props.getProduct(this.productId);
    this.props.getOpenOrder();
  }
  updateInventory() {
    console.log(this.props);
    var user_id = this.props.id;
    if (user_id) {
      this.props.getOpenOrder();
      console.log(this.props.openOrder);
      this.props.updateProductInventory(this.productId);
      this.props.updateCurrentOrder(this.productId, this.props.openOrder.id);
    } else {
      console.log(this.props.id);
      var existing = JSON.parse(localStorage.getItem('cart'));
      if (existing) {
        var [updateQuant] = existing.filter(
          (e) => e.productId === this.props.singleProduct.id
        );
        //need to check if the posterId already exists, if it does just update quantit
        if (updateQuant) {
          updateQuant.quantity++;
          localStorage.setItem('cart', JSON.stringify(existing));
        } else {
          existing.push({
            productId: this.props.singleProduct.id,
            name: this.props.singleProduct.name,
            quantity: 1,
            price: this.props.singleProduct.price,
            image: this.props.singleProduct.image,
          });
          localStorage.setItem('cart', JSON.stringify(existing));
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
    toast.success('Added to cart!');
  }

  render() {
    const {singleProduct} = this.props;
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
              <ButtonBase sx={{width: 500, height: 500, margin: 2}}>
                <Img alt={singleProduct.name} src={singleProduct.image} />
              </ButtonBase>
            </Grid>
            <Grid item xs={12} sm container>
              <Grid item xs container direction="column" spacing={2}>
                <Grid item xs>
                  <Typography gutterBottom variant="subtitle1" component="div">
                    <h2> {singleProduct.name} </h2>
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
                    <Typography sx={{cursor: 'pointer'}} variant="body2">
                      <Button
                        variant="contained"
                        onClick={() => {
                          this.updateInventory();
                        }}
                      >
                        ADD TO CART
                      </Button>
                    </Typography>
                  </Grid>
                ) : (
                  <h3>OUT OF STOCK</h3>
                )}
              </Grid>
              <Grid item />
            </Grid>
          </Grid>
        </Paper>
        <Toaster />
      </div>
    );
  }
}
const mapState = (state) => {
  return {
    singleProduct: state.product,
    id: state.user.id,
    openOrder: state.order,
  };
};

const mapDispatch = (dispatch) => {
  return {
    getProduct: (id) => dispatch(getOneProduct(id)),
    updateProductInventory: (id) => dispatch(subtractProductInv(id)),
    updateCurrentOrder: (productId, openOrderid) =>
      dispatch(updateCurrOrder(productId, openOrderid)),
    getOpenOrder: () => dispatch(getCurrOrder()),
    getGuestOrder: (id) => dispatch(getGstOrder(id)),
  };
};

export default connect(mapState, mapDispatch)(SingleProduct);
