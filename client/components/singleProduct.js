import React from 'react'
import {connect} from 'react-redux'
import {getOneProduct, updateProductInv} from '../store/singleProduct'
import {getCurrOrder} from '../store/orders'
import {updateCurrOrder} from '../store/productOrders'

export class SingleProduct extends React.Component {
  constructor(props) {
    super(props)
    this.updateInventory = this.updateInventory.bind(this)
  }

  productId = window.location.href.split('/')[4]
  componentDidMount() {
    this.props.getProduct(this.productId)
    this.props.getOpenOrder()
  }
  updateInventory() {
    this.props.updateProductInventory(this.productId)
    this.props.updateCurrentOrder(this.productId, this.props.openOrder.id)
  }

  render() {
    const {singleProduct} = this.props
    console.log(this.props)
    return (
      <div id="singleProduct">
        <h1 id="singleProductTitle">{singleProduct.name}</h1>
        <div className="card" key={singleProduct.id}>
          <img
            id="productImage"
            src={singleProduct.image}
            alt={singleProduct.name}
          />
          <h2 className="description">{singleProduct.description}</h2>
          <h2 className="price">{singleProduct.price}</h2>
          <h2 className="inventory">{singleProduct.inventory}</h2>
          <div className="cart">
            <a className="add">
              {/*  */}
              <input
                type="button"
                value="ADD TO CART"
                onClick={this.updateInventory}
              />
              {/*  */}
            </a>
          </div>
        </div>
      </div>
    )
  }
}
const mapState = state => {
  return {
    singleProduct: state.product,
    id: state.user.id,
    openOrder: state.order
  }
}

const mapDispatch = dispatch => {
  return {
    getProduct: id => dispatch(getOneProduct(id)),
    updateProductInventory: id => dispatch(updateProductInv(id)),
    updateCurrentOrder: (productId, openOrderid) =>
      dispatch(updateCurrOrder(productId, openOrderid)),
    getOpenOrder: () => dispatch(getCurrOrder())
  }
}

export default connect(mapState, mapDispatch)(SingleProduct)
