import React from 'react';
import {connect} from 'react-redux';
import {getAllProducts} from '../store/products';
import {Link} from 'react-router-dom';
import ImageList from '@mui/material/ImageList';
import ImageListItem from '@mui/material/ImageListItem';
import ImageListItemBar from '@mui/material/ImageListItemBar';

export class AllProducts extends React.Component {
  componentDidMount() {
    this.props.getProducts();
  }

  render() {
    const {products} = this.props;

    return (
      <div id="allProducts">
        <div className="outerContainer">
          <ImageList sx={{p: 2}} cols={3}>
            {products.map((product) => (
              <ImageListItem key={product.id} sx={{p: 1}}>
                <img src={product.image} alt={product.name} loading="lazy" />
                <ImageListItemBar
                  sx={{p: 1, color: 'orange'}}
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
        </div>
      </div>
    );
  }
}
const mapState = (state) => {
  return {
    products: state.products,
  };
};

const mapDispatch = (dispatch) => {
  return {
    getProducts: () => dispatch(getAllProducts()),
  };
};

export default connect(mapState, mapDispatch)(AllProducts);
