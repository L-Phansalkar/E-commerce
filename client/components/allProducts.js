import React from 'react'
import {connect} from 'react-redux'
import {getAllProducts} from '../store/products'
import {Link} from 'react-router-dom'
import ImageList from '@mui/material/ImageList'
import ImageListItem from '@mui/material/ImageListItem'
import ImageListItemBar from '@mui/material/ImageListItemBar'

export class AllProducts extends React.Component {
  componentDidMount() {
    this.props.getProducts()
  }

  render() {
    const {products} = this.props

    return (
      <div id="allProducts">
        <div className="outerContainer">
          <ImageList>
            {products.map(product => (
              <ImageListItem key={product.id}>
                <img
                  src={`${product.image}?w=248&fit=crop&auto=format`}
                  srcSet={`${
                    product.image
                  }?w=248&fit=crop&auto=format&dpr=2 2x`}
                  alt={product.name}
                  loading="lazy"
                />

                <ImageListItemBar
                  title={
                    <Link to={`/products/${product.id}`} as="/products/:id">
                      {product.name}
                    </Link>
                  }
                  subtitle={<span>{product.price}</span>}
                  // position="below"
                />
              </ImageListItem>
            ))}
          </ImageList>

          {/* <div className="card" key={product.id}>
              <img id="productImage" src={product.image} alt={product.name} />
              
              <h2 className="price">{product.price}</h2>
            </div>
          ))} */}
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
