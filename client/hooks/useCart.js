// client/hooks/useCart.js

import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getCurrOrder } from '../store/orders';
import { subtractProductInv } from '../store/singleProduct';
import { updateCurrOrder } from '../store/productOrders';
import { 
  getLocalCart, 
  addToLocalCart, 
  transferCartToDatabase,
  isUserLoggedIn 
} from '../utils/cartUtils';
import toast from 'react-hot-toast';

/**
 * Custom hook for managing cart state across the application
 * Handles both localStorage (for guests) and database (for logged-in users)
 */
export const useCart = () => {
  const dispatch = useDispatch();
  const user = useSelector(state => state.user);
  const openOrder = useSelector(state => state.order);
  
  const [localCart, setLocalCart] = useState([]);
  const [isTransferring, setIsTransferring] = useState(false);
  const [hasTransferred, setHasTransferred] = useState(false);
  
  const isLoggedIn = isUserLoggedIn(user);

  // Load local cart on mount
  useEffect(() => {
    if (!isLoggedIn) {
      const cart = getLocalCart();
      setLocalCart(cart);
    }
  }, [isLoggedIn]);

  // Get current order for logged-in users
  useEffect(() => {
    if (isLoggedIn) {
      dispatch(getCurrOrder());
    }
  }, [isLoggedIn, dispatch]);

  // Transfer cart when user logs in
  useEffect(() => {
    const handleTransfer = async () => {
      if (isLoggedIn && openOrder.id && !hasTransferred && localCart.length > 0) {
        setIsTransferring(true);
        try {
          const actions = { updateCurrOrder, subtractProductInv };
          const result = await transferCartToDatabase(
            localCart,
            dispatch,
            actions,
            openOrder.id
          );
          
          if (result.success) {
            setLocalCart([]);
            setHasTransferred(true);
            toast.success(result.message);
            // Refresh order to show transferred items
            dispatch(getCurrOrder());
          } else {
            toast.error(result.message);
          }
        } catch (error) {
          console.error('Cart transfer error:', error);
          toast.error('Failed to transfer cart');
        } finally {
          setIsTransferring(false);
        }
      }
    };

    handleTransfer();
  }, [isLoggedIn, openOrder.id, localCart, hasTransferred, dispatch]);

  // Add item to cart (works for both guests and logged-in users)
  const addToCart = async (product) => {
    try {
      if (isLoggedIn && openOrder.id) {
        // Add to database
        await dispatch(updateCurrOrder(product.id, openOrder.id));
        await dispatch(subtractProductInv(product.id));
        await dispatch(getCurrOrder()); // Refresh order
        toast.success('Added to cart!');
      } else {
        // Add to localStorage
        const updatedCart = addToLocalCart(product);
        setLocalCart(updatedCart);
        toast.success('Added to cart!');
      }
    } catch (error) {
      console.error('Error adding to cart:', error);
      toast.error('Failed to add item to cart');
    }
  };

  // Get current cart items
  const getCartItems = () => {
    if (isLoggedIn && openOrder.productOrders) {
      return openOrder.productOrders;
    }
    return localCart;
  };

  // Get cart item count
  const getCartItemCount = () => {
    const items = getCartItems();
    if (isLoggedIn && openOrder.productOrders) {
      return openOrder.productOrders.reduce((total, item) => total + item.quantity, 0);
    }
    return localCart.reduce((total, item) => total + item.quantity, 0);
  };

  // Check if cart is empty
  const isCartEmpty = () => {
    const items = getCartItems();
    return !items || items.length === 0;
  };

  return {
    // State
    isLoggedIn,
    isTransferring,
    cartItems: getCartItems(),
    cartItemCount: getCartItemCount(),
    isCartEmpty: isCartEmpty(),
    
    // Actions
    addToCart,
    
    // For backwards compatibility with existing components
    localCart,
    openOrder
  };
};