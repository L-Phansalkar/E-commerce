import React from 'react'
import {connect} from 'react-redux'
import {getCurrOrder} from '../store/orders'
import {updateProductInv} from '../store/singleProduct'
import {updateCurrOrder} from '../store/productOrders'
import Stripe from './Stripe'
import {Link} from 'react-router-dom'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import Divider from '@mui/material/Divider'
import ListItemText from '@mui/material/ListItemText'
import ListItemAvatar from '@mui/material/ListItemAvatar'
import Avatar from '@mui/material/Avatar'
import Typography from '@mui/material/Typography'

export class Cart extends React.Component {
  componentDidMount() {
    console.log(this.props)
    this.props.getCurrentOrder()
  }

  render() {
    const {openOrder} = this.props
    const productList = openOrder.productOrders
    console.log(openOrder)
    var existing = JSON.parse(localStorage.getItem('cart'))
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
        {productList ? (
          <List sx={{bgcolor: 'background.paper', p: 2}}>
            {productList.map(item => (
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
                    </Typography>
                  }
                />
              </ListItem>
            ))}
          </List>
        ) : (
          <div />
        )}
        {existing ? (
          <List sx={{bgcolor: 'background.paper'}}>
            {existing.map(item => (
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
    )
  }
}

const mapState = state => {
  return {
    openOrder: state.order
  }
}

const mapDispatch = dispatch => {
  return {
    getCurrentOrder: () => dispatch(getCurrOrder()),
    updateProductInventory: id => dispatch(updateProductInv(id)),
    updateCurrentOrder: (productId, openOrderid) =>
      dispatch(updateCurrOrder(productId, openOrderid))
  }
}

export default connect(mapState, mapDispatch)(Cart)
