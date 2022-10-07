import React from 'react'
import {connect} from 'react-redux'
import {getCurrOrder} from '../store/orders'
import {updateProductInv} from '../store/singleProduct'
import {updateCurrOrder} from '../store/productOrders'
import Stripe from './Stripe'
import {Link} from 'react-router-dom'

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
        <h1>CART</h1>
        {productList ? (
          <div className="outerContainer">
            {productList.map(item => (
              <div className="card" key={item.product.name}>
                <Link to={`/products/${item.product.id}`} as="/products/:id">
                  {item.product.name}
                </Link>
                <h2 className="price">{item.product.price}</h2>
                <h2 className="quantity">{item.quantity}</h2>
              </div>
            ))}
          </div>
        ) : (
          <div />
        )}
        {existing ? (
          <div className="outerContainer">
            {existing.map(item => (
              <div className="card" key={item.name}>
                <Link to={`/products/${item.productId}`} as="/products/:id">
                  {item.name}
                </Link>
                <h2 className="price">{item.price}</h2>
                <h2 className="quantity">{item.quantity}</h2>
              </div>
            ))}
          </div>
        ) : (
          <div />
        )}
        {/* {!productList && !existing ? (<div>add something</div> ): (<Stripe/>) } */}
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
