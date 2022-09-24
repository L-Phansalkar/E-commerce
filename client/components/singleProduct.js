import React from 'react'
import {connect} from 'react-redux'
import {getOneProduct} from '../store/product'

export class SingleProduct extends React.Component {
  componentDidMount() {
    var id = window.location.href.split('/')[4]
    console.log(id)
    this.props.getProduct(id)
  }

  render() {
    const {product} = this.props
    console.log(this.props)
    return (
      <div id="singleProduct">
        <h1 id="singleProductTitle">{product.name}</h1>
        <div className="card" key={product.id}>
          <img id="productImage" src={product.image} alt={product.name} />
          <h2 className="description">{product.description}</h2>
          <h2 className="price">{product.price}</h2>
          <h2 className="inventory">{product.inventory}</h2>
        </div>
      </div>
    )
  }
}
const mapState = state => {
  return {
    product: state.products
  }
}

const mapDispatch = dispatch => {
  return {
    getProduct: id => dispatch(getOneProduct(id))
  }
}

export default connect(mapState, mapDispatch)(SingleProduct)
