// client/utils/cartUtils.js

/**
 * Utility functions for cart management across localStorage and database
 */

// Get cart from localStorage
export const getLocalCart = () => {
  try {
    const cart = localStorage.getItem('cart');
    return cart ? JSON.parse(cart) : [];
  } catch (error) {
    console.error('Error reading cart from localStorage:', error);
    return [];
  }
};

// Set cart in localStorage
export const setLocalCart = (cart) => {
  try {
    if (cart && cart.length > 0) {
      localStorage.setItem('cart', JSON.stringify(cart));
    } else {
      localStorage.removeItem('cart');
    }
  } catch (error) {
    console.error('Error saving cart to localStorage:', error);
  }
};

// Clear cart from localStorage
export const clearLocalCart = () => {
  try {
    localStorage.removeItem('cart');
  } catch (error) {
    console.error('Error clearing cart from localStorage:', error);
  }
};

// Add item to localStorage cart
export const addToLocalCart = (product) => {
  const cart = getLocalCart();
  const existingItemIndex = cart.findIndex(item => item.productId === product.id);
  
  if (existingItemIndex !== -1) {
    // Item exists, increment quantity
    cart[existingItemIndex].quantity++;
  } else {
    // Item doesn't exist, add new item
    cart.push({
      productId: product.id,
      name: product.name,
      quantity: 1,
      price: product.price,
      image: product.image,
    });
  }
  
  setLocalCart(cart);
  return cart;
};

// Remove item from localStorage cart
export const removeFromLocalCart = (productId) => {
  const cart = getLocalCart();
  const filteredCart = cart.filter(item => item.productId !== productId);
  setLocalCart(filteredCart);
  return filteredCart;
};

// Update item quantity in localStorage cart
export const updateLocalCartQuantity = (productId, change) => {
  const cart = getLocalCart();
  const itemIndex = cart.findIndex(item => item.productId === productId);
  
  if (itemIndex !== -1) {
    cart[itemIndex].quantity += change;
    
    // Remove item if quantity becomes 0 or less
    if (cart[itemIndex].quantity <= 0) {
      cart.splice(itemIndex, 1);
    }
  }
  
  setLocalCart(cart);
  return cart;
};

// Check if user is logged in
export const isUserLoggedIn = (user) => {
  return user && user.id;
};

// Transfer localStorage cart to database
export const transferCartToDatabase = async (localCart, dispatch, actions, orderId) => {
  if (!localCart || localCart.length === 0) {
    return { success: true, message: 'No items to transfer' };
  }

  try {
    // Transfer each item
    for (const item of localCart) {
      for (let i = 0; i < item.quantity; i++) {
        // Add to database order
        await dispatch(actions.updateCurrOrder(item.productId, orderId));
        // Update inventory
        await dispatch(actions.subtractProductInv(item.productId));
      }
    }
    
    // Clear localStorage after successful transfer
    clearLocalCart();
    
    return { 
      success: true, 
      message: `Successfully transferred ${localCart.length} item(s) to your account` 
    };
  } catch (error) {
    console.error('Error transferring cart to database:', error);
    return { 
      success: false, 
      message: 'Failed to transfer cart items',
      error 
    };
  }
};

// Get total items count in localStorage cart
export const getLocalCartItemCount = () => {
  const cart = getLocalCart();
  return cart.reduce((total, item) => total + item.quantity, 0);
};

// Get total price of localStorage cart
export const getLocalCartTotal = () => {
  const cart = getLocalCart();
  return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
};

// Check if a product exists in localStorage cart
export const isInLocalCart = (productId) => {
  const cart = getLocalCart();
  return cart.some(item => item.productId === productId);
};

// Get specific item from localStorage cart
export const getLocalCartItem = (productId) => {
  const cart = getLocalCart();
  return cart.find(item => item.productId === productId) || null;
};