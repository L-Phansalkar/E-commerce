import React from 'react'
import {connect} from 'react-redux'
import {getOneProduct} from '../store/singleProduct'

export class SingleProduct extends React.Component {
  componentDidMount() {
    var id = window.location.href.split('/')[4]
    this.props.getProduct(id)
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
        </div>
      </div>
    )
  }
}
const mapState = state => {
  return {
    singleProduct: state.product
  }
}

const mapDispatch = dispatch => {
  return {
    getProduct: id => dispatch(getOneProduct(id))
  }
}

export default connect(mapState, mapDispatch)(SingleProduct)
