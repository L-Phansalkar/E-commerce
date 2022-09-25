import React from 'react'
import {connect} from 'react-redux'
import {getCurrOrder} from '../store/orders'
import {Link} from 'react-router-dom'

export class Cart extends React.Component {
  componentDidMount() {
    this.props.getCurrentOrder()
  }

  render() {
    const {openOrder} = this.props
    const productList = openOrder.productOrders
    console.log('render', this.props, 'open', openOrder, 'list', productList)
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
    getCurrentOrder: () => dispatch(getCurrOrder())
  }
}

export default connect(mapState, mapDispatch)(Cart)
