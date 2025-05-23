const API_BASE_URL = process.env.REACT_NATIVE_API_URL || 'https://backend-practice.eurisko.me';

export interface Product {
  id: string;
  name: string;
  price: number;
  description?: string;
  image?: string;
  category?: string;
  inStock?: boolean;
}

export interface CartItem {
  id: string;
  productId: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
  product?: Product;
}

export interface Cart {
  id: string;
  userId: string;
  items: CartItem[];
  totalPrice: number;
  totalItems: number;
  createdAt: string;
  updatedAt: string;
}

export interface AddToCartParams {
  productId: string;
  quantity: number;
}

export interface UpdateCartItemParams {
  quantity: number;
}

export interface CartResponse {
  success: boolean;
  cart: Cart;
  message: string;
}

export interface CartItemResponse {
  success: boolean;
  item: CartItem;
  message: string;
}

/**
 * Get user's cart with all items
 */
export const getCart = async (token: string): Promise<Cart> => {
  try {
    const response = await fetch(`${API_BASE_URL}/cart`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data.cart || data;
  } catch (error) {
    console.error('Error fetching cart:', error);
    throw error;
  }
};

/**
 * Add item to cart
 */
export const addToCart = async (
  token: string, 
  params: AddToCartParams
): Promise<CartItemResponse> => {
  try {
    const response = await fetch(`${API_BASE_URL}/cart/items`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(params),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || `HTTP error! status: ${response.status}`);
    }

    return data;
  } catch (error) {
    console.error('Error adding to cart:', error);
    throw error;
  }
};

/**
 * Update cart item quantity
 */
export const updateCartItem = async (
  token: string, 
  itemId: string, 
  quantity: number
): Promise<CartItemResponse> => {
  try {
    const response = await fetch(`${API_BASE_URL}/cart/items/${itemId}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ quantity }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || `HTTP error! status: ${response.status}`);
    }

    return data;
  } catch (error) {
    console.error('Error updating cart item:', error);
    throw error;
  }
};

/**
 * Remove item from cart
 */
export const removeFromCart = async (
  token: string, 
  itemId: string
): Promise<{ success: boolean; message: string }> => {
  try {
    const response = await fetch(`${API_BASE_URL}/cart/items/${itemId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || `HTTP error! status: ${response.status}`);
    }

    return data;
  } catch (error) {
    console.error('Error removing from cart:', error);
    throw error;
  }
};

/**
 * Clear entire cart
 */
export const clearCart = async (
  token: string
): Promise<{ success: boolean; message: string }> => {
  try {
    const response = await fetch(`${API_BASE_URL}/cart/clear`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || `HTTP error! status: ${response.status}`);
    }

    return data;
  } catch (error) {
    console.error('Error clearing cart:', error);
    throw error;
  }
};

/**
 * Get cart item count
 */
export const getCartItemCount = async (token: string): Promise<number> => {
  try {
    const response = await fetch(`${API_BASE_URL}/cart/count`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      // Fallback to getting full cart and counting items
      const cart = await getCart(token);
      return cart.totalItems || cart.items?.reduce((sum, item) => sum + item.quantity, 0) || 0;
    }

    const data = await response.json();
    return data.count || 0;
  } catch (error) {
    console.error('Error getting cart count:', error);
    // Fallback to getting full cart and counting items
    try {
      const cart = await getCart(token);
      return cart.totalItems || cart.items?.reduce((sum, item) => sum + item.quantity, 0) || 0;
    } catch (fallbackError) {
      console.error('Fallback cart count failed:', fallbackError);
      return 0;
    }
  }
};

/**
 * Get cart total price
 */
export const getCartTotal = async (token: string): Promise<number> => {
  try {
    const cart = await getCart(token);
    return cart.totalPrice || cart.items?.reduce((sum, item) => sum + (item.price * item.quantity), 0) || 0;
  } catch (error) {
    console.error('Error getting cart total:', error);
    return 0;
  }
};

/**
 * Check if product is in cart
 */
export const isInCart = async (token: string, productId: string): Promise<boolean> => {
  try {
    const cart = await getCart(token);
    return cart.items?.some(item => item.productId === productId) || false;
  } catch (error) {
    console.error('Error checking if product is in cart:', error);
    return false;
  }
};

/**
 * Get specific cart item by product ID
 */
export const getCartItem = async (token: string, productId: string): Promise<CartItem | null> => {
  try {
    const cart = await getCart(token);
    return cart.items?.find(item => item.productId === productId) || null;
  } catch (error) {
    console.error('Error getting cart item:', error);
    return null;
  }
};

/**
 * Update multiple cart items at once
 */
export const updateMultipleCartItems = async (
  token: string, 
  updates: Array<{ itemId: string; quantity: number }>
): Promise<CartResponse> => {
  try {
    const response = await fetch(`${API_BASE_URL}/cart/items/bulk`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ updates }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || `HTTP error! status: ${response.status}`);
    }

    return data;
  } catch (error) {
    console.error('Error updating multiple cart items:', error);
    throw error;
  }
};

/**
 * Apply coupon/discount code to cart
 */
export const applyCoupon = async (
  token: string, 
  couponCode: string
): Promise<CartResponse> => {
  try {
    const response = await fetch(`${API_BASE_URL}/cart/coupon`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ couponCode }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || `HTTP error! status: ${response.status}`);
    }

    return data;
  } catch (error) {
    console.error('Error applying coupon:', error);
    throw error;
  }
};

/**
 * Remove coupon from cart
 */
export const removeCoupon = async (token: string): Promise<CartResponse> => {
  try {
    const response = await fetch(`${API_BASE_URL}/cart/coupon`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || `HTTP error! status: ${response.status}`);
    }

    return data;
  } catch (error) {
    console.error('Error removing coupon:', error);
    throw error;
  }
};

/**
 * Sync cart with server (useful for offline/online sync)
 */
export const syncCart = async (
  token: string, 
  localCartItems: CartItem[]
): Promise<CartResponse> => {
  try {
    const response = await fetch(`${API_BASE_URL}/cart/sync`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ items: localCartItems }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || `HTTP error! status: ${response.status}`);
    }

    return data;
  } catch (error) {
    console.error('Error syncing cart:', error);
    throw error;
  }
};