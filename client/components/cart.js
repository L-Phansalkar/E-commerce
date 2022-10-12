import React from 'react';
import {connect} from 'react-redux';
import {getCurrOrder} from '../store/orders';
import {subtractProductInv, addProductInv} from '../store/singleProduct';
import {
  updateCurrOrder,
  decreaseCurrProd,
  deleteCurrProd,
} from '../store/productOrders';

import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import {Button} from '@mui/material';

export class Cart extends React.Component {
  constructor(props) {
    super(props);
    this.subtract = this.subtract.bind(this);
    this.add = this.add.bind(this);
    this.delete = this.delete.bind(this);
  }
  componentDidMount() {
    this.props.getCurrentOrder();
  }

  subtract(item) {
    this.props.decreaseQuant(item.product.id, this.props.openOrder.id);
  }

  delete(item) {
    this.props.deleteCartItem(item.product.id, this.props.openOrder.id);
  }

  add(item) {
    this.props.updateProductInventory(item.product.id);
    this.props.updateCurrentOrder(item.product.id, this.props.openOrder.id);
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.props.openOrder !== prevProps.openOrder) {
      this.props.getCurrentOrder();
    }
  }

  render() {
    const {openOrder} = this.props;
    console.log(openOrder);
    let existing = JSON.parse(localStorage.getItem('cart'));
    // if (openOrder && existing){
    //   console.log("i got both")
    //   console.log(this.props.openOrder)
    //   console.log(existing)
    //   existing.forEach(item => {
    //     var quantity = item.quantity
    //     console.log(quantity)
    //     while (quantity >0){
    //     this.props.updateProductInventory(item.productId)
    //     this.props.updateCurrentOrder(item.productId, this.props.openOrder.id)
    //     quantity = quantity-1
    //     console.log(quantity)
    //     }
    // })
    // localStorage.removeItem("cart")

    return (
      <div id="cart">
        {/* this is for logged in guest */}

        {openOrder.productOrders ? (
          <List sx={{bgcolor: 'background.paper', p: 2}}>
            {openOrder.productOrders.map((item) => (
              <ListItem alignItems="center" key={item.product.name}>
                <ListItemAvatar>
                  <Avatar
                    sx={{width: 200, height: 200}}
                    alt={item.product.name}
                    src={item.product.image}
                  />
                </ListItemAvatar>
                <ListItemText
                  sx={{display: 'inline', p: 3}}
                  primary={<h3>{item.product.name}</h3>}
                  secondary={
                    <Typography
                      sx={{display: 'inline', alignItems: 'flex-end'}}
                      component="span"
                      variant="body2"
                      color="text.primary"
                    >
                      {item.quantity}
                      {`    at  $${item.product.price} each`}
                      <br />
                      {item.quantity > 1 ? (
                        <Button
                          variant="contained"
                          onClick={() => {
                            this.subtract(item);
                          }}
                        >
                          MINUS
                        </Button>
                      ) : (
                        <div />
                      )}

                      <Button
                        variant="contained"
                        onClick={() => {
                          this.add(item);
                        }}
                      >
                        PLUS
                      </Button>

                      <Button
                        variant="contained"
                        onClick={() => {
                          this.delete(item);
                        }}
                      >
                        REMOVE FROM CART
                      </Button>
                    </Typography>
                  }
                />
              </ListItem>
            ))}
          </List>
        ) : (
          <div />
        )}

        {/* this is for not logged in guest  */}

        {existing ? (
          <List sx={{bgcolor: 'background.paper'}}>
            {existing.map((item) => (
              <ListItem alignItems="flex-start" key={item.name}>
                <ListItemAvatar>
                  <Avatar alt={item.name} src={item.image} />
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
          </List>
        ) : (
          <div />
        )}
      </div>
    );
  }
}

const mapState = (state) => {
  return {
    openOrder: state.order,
  };
};

const mapDispatch = (dispatch) => {
  return {
    getCurrentOrder: () => dispatch(getCurrOrder()),
    decreaseQuant: (productId, openOrderid) =>
      dispatch(decreaseCurrProd(productId, openOrderid)),
    deleteCartItem: (productId, openOrderid) =>
      dispatch(deleteCurrProd(productId, openOrderid)),
    subtProductInventory: (id) => dispatch(subtractProductInv(id)),
    addProductInventory: (id) => dispatch(addProductInv(id)),
    updateCurrentOrder: (productId, openOrderid) =>
      dispatch(updateCurrOrder(productId, openOrderid)),
  };
};

export default connect(mapState, mapDispatch)(Cart);
