import React from 'react'
import {connect} from 'react-redux'
import {getAllProducts} from '../store/product'

export class AllProducts extends React.Component {
  componentDidMount() {
    this.props.getProducts()
  }

  render() {
    const {products} = this.props
    console.log(this.props)
    return (
      <div id="allProducts">
        <h1 id="allProductsTitle">products</h1>
        <div className="outerContainer">
          {products.map(product => (
            <div className="card" key={product.id}>
              <img id="productImage" src={product.image} alt={product.name} />
              <h2 className="name">{product.name}</h2>
              <h2 className="price">{product.price}</h2>
            </div>
          ))}
        </div>
      </div>
    )
  }
}
const mapState = state => {
  return {
    products: state.products
  }
}

const mapDispatch = dispatch => {
  return {
    getProducts: () => dispatch(getAllProducts())
  }
}

export default connect(mapState, mapDispatch)(AllProducts)
