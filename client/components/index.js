/**
 * `components/index.js` exists simply as a 'central export' for our components.
 * This way, we can import all of our components from the same place, rather than
 * having to figure out which file they belong to!
 */
export {default as Navbar} from './navbar';
export {default as UserHome} from './user-home';
export {default as Home} from './home';
export {default as Confirm} from './Confirm';
export {default as AllProducts} from './allProducts';
export {default as SingleProduct} from './SingleProduct';
export {default as Cart} from './Cart';
export {default as CartFunctional} from './CartFunctional';

export {default as CheckoutForm} from './CheckoutForm';
export {Login, Signup} from './auth-form';
