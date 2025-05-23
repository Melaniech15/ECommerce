
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'https://backend-practice.eurisko.me';

export interface Product {
  id: string;
  name: string;
  price: number;
  description?: string;
  image?: string;
  category?: string;
  inStock?: boolean;
}

export interface FavoriteItem {
  id: string;
  userId: string;
  productId: string;
  product: Product;
  createdAt: string;
}

export interface GetFavoritesParams {
  search?: string;
  category?: string;
  sortBy?: 'name' | 'price' | 'dateAdded';
  sortOrder?: 'asc' | 'desc';
  page?: number;
  limit?: number;
}

export interface AddFavoriteResponse {
  success: boolean;
  favorite: FavoriteItem;
  message: string;
}

export interface RemoveFavoriteResponse {
  success: boolean;
  message: string;
}

export const getFavorites = async (
  token: string, 
  params: GetFavoritesParams = {}
): Promise<Product[]> => {
  try {
    const queryParams = new URLSearchParams();
    
    if (params.search) queryParams.append('search', params.search);
    if (params.category) queryParams.append('category', params.category);
    if (params.sortBy) queryParams.append('sortBy', params.sortBy);
    if (params.sortOrder) queryParams.append('sortOrder', params.sortOrder);
    if (params.page) queryParams.append('page', params.page.toString());
    if (params.limit) queryParams.append('limit', params.limit.toString());

    const url = `${API_BASE_URL}/favorites${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    
    const response = await fetch(url, {
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
    
    // Extract products from favorites response
    if (data.favorites && Array.isArray(data.favorites)) {
      return data.favorites.map((fav: FavoriteItem) => fav.product);
    }
    
    // Handle direct product array response
    return data.products || data || [];
  } catch (error) {
    console.error('Error fetching favorites:', error);
    throw error;
  }
};

/**
 * Add a product to favorites
 */
export const addFavorite = async (
  token: string, 
  productId: string
): Promise<AddFavoriteResponse> => {
  try {
    const response = await fetch(`${API_BASE_URL}/favorites`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ productId }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || `HTTP error! status: ${response.status}`);
    }

    return data;
  } catch (error) {
    console.error('Error adding favorite:', error);
    throw error;
  }
};

/**
 * Remove a product from favorites
 */
export const removeFavorite = async (
  token: string, 
  productId: string
): Promise<RemoveFavoriteResponse> => {
  try {
    const response = await fetch(`${API_BASE_URL}/favorites/${productId}`, {
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
    console.error('Error removing favorite:', error);
    throw error;
  }
};

/**
 * Check if a product is in favorites
 */
export const isFavorite = async (
  token: string, 
  productId: string
): Promise<boolean> => {
  try {
    const response = await fetch(`${API_BASE_URL}/favorites/check/${productId}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      // If endpoint doesn't exist, fall back to checking favorites list
      const favorites = await getFavorites(token);
      return favorites.some(product => product.id === productId);
    }

    const data = await response.json();
    return data.isFavorite || false;
  } catch (error) {
    console.error('Error checking favorite status:', error);
    // Fallback: check favorites list
    try {
      const favorites = await getFavorites(token);
      return favorites.some(product => product.id === productId);
    } catch (fallbackError) {
      console.error('Fallback favorite check failed:', fallbackError);
      return false;
    }
  }
};

/**
 * Toggle favorite status of a product
 */
export const toggleFavorite = async (
  token: string, 
  productId: string
): Promise<{ isFavorite: boolean; message: string }> => {
  try {
    const currentlyFavorite = await isFavorite(token, productId);
    
    if (currentlyFavorite) {
      await removeFavorite(token, productId);
      return { isFavorite: false, message: 'Removed from favorites' };
    } else {
      await addFavorite(token, productId);
      return { isFavorite: true, message: 'Added to favorites' };
    }
  } catch (error) {
    console.error('Error toggling favorite:', error);
    throw error;
  }
};

/**
 * Get favorites count
 */
export const getFavoritesCount = async (token: string): Promise<number> => {
  try {
    const response = await fetch(`${API_BASE_URL}/favorites/count`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      // Fallback to getting all favorites and counting
      const favorites = await getFavorites(token);
      return favorites.length;
    }

    const data = await response.json();
    return data.count || 0;
  } catch (error) {
    console.error('Error getting favorites count:', error);
    // Fallback to getting all favorites and counting
    try {
      const favorites = await getFavorites(token);
      return favorites.length;
    } catch (fallbackError) {
      console.error('Fallback count failed:', fallbackError);
      return 0;
    }
  }
};

/**
 * Clear all favorites
 */
export const clearFavorites = async (token: string): Promise<RemoveFavoriteResponse> => {
  try {
    const response = await fetch(`${API_BASE_URL}/favorites/clear`, {
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
    console.error('Error clearing favorites:', error);
    throw error;
  }
};

/**
 * Get favorite products by category
 */
export const getFavoritesByCategory = async (
  token: string, 
  category: string
): Promise<Product[]> => {
  return getFavorites(token, { category });
};

/**
 * Search favorites
 */
export const searchFavorites = async (
  token: string, 
  searchTerm: string
): Promise<Product[]> => {
  return getFavorites(token, { search: searchTerm });
};