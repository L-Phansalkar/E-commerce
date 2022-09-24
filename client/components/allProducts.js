import React from 'react'
import {connect} from 'react-redux'
import {getAllProducts} from '../store/products'
import {Link} from 'react-router-dom'

export class AllProducts extends React.Component {
  componentDidMount() {
    console.log(this.props)
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
              <Link to={`/products/${product.id}`} as="/products/:id">
                {product.name}
              </Link>
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
