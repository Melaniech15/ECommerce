import { apiService } from './api';

export interface Product {
  id: string;
  _id: string;
  name: string;
  description: string;
  price: number;
  images: Array<{
    url: string;
    publicId: string;
  }>;
  location: {
    latitude: number;
    longitude: number;
    address: string;
  };
  owner: {
    _id: string;
    name: string;
    email: string;
    profileImage?: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface ProductInput {
  name: string;
  description: string;
  price: number;
  images: string[];
  location: {
    latitude: number;
    longitude: number;
    address: string;
  };
}

export interface ProductsQuery {
  page?: number;
  limit?: number;
  search?: string;
  sortBy?: 'name' | 'price' | 'createdAt';
  sortOrder?: 'asc' | 'desc';
}

export interface ProductsResponse {
  items(items: any): unknown;
  products: Product[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

class ProductsService {
  async getProducts(query: ProductsQuery = {}): Promise<ProductsResponse> {
    const queryParams = new URLSearchParams();
    
    if (query.page) queryParams.append('page', query.page.toString());
    if (query.limit) queryParams.append('limit', query.limit.toString());
    if (query.search) queryParams.append('search', query.search);
    if (query.sortBy) queryParams.append('sortBy', query.sortBy);
    if (query.sortOrder) queryParams.append('sortOrder', query.sortOrder);

    const endpoint = `/products?${queryParams.toString()}`;
    const response = await apiService.get<ProductsResponse>(endpoint, false);
    
    if (response.success) {
      return response.data;
    } else {
      throw new Error(response.message || 'Failed to fetch products');
    }
  }

  async getProductById(productId: string): Promise<Product> {
    const response = await apiService.get<Product>(`/products/${productId}`, false);
    
    if (response.success) {
      return response.data;
    } else {
      throw new Error(response.message || 'Failed to fetch product');
    }
  }

  async createProduct(productData: ProductInput): Promise<Product> {
    const response = await apiService.post<Product>('/products', productData);
    
    if (response.success) {
      return response.data;
    } else {
      throw new Error(response.message || 'Failed to create product');
    }
  }

  async updateProduct(productId: string, productData: Partial<ProductInput>): Promise<Product> {
    const response = await apiService.put<Product>(`/products/${productId}`, productData);
    
    if (response.success) {
      return response.data;
    } else {
      throw new Error(response.message || 'Failed to update product');
    }
  }

  async deleteProduct(productId: string): Promise<void> {
    const response = await apiService.delete(`/products/${productId}`);
    
    if (!response.success) {
      throw new Error(response.message || 'Failed to delete product');
    }
  }

  async uploadProductImages(images: string[]): Promise<string[]> {
    const formData = new FormData();
    
    images.forEach((imageUri, index) => {
      formData.append('images', {
        uri: imageUri,
        type: 'image/jpeg',
        name: `image_${index}.jpg`,
      } as any);
    });

    const response = await apiService.uploadFormData<{ urls: string[] }>('/upload/images', formData);
    
    if (response.success) {
      return response.data.urls;
    } else {
      throw new Error(response.message || 'Failed to upload images');
    }
  }

  async getUserProducts(userId: string, query: ProductsQuery = {}): Promise<ProductsResponse> {
    const queryParams = new URLSearchParams();
    
    if (query.page) queryParams.append('page', query.page.toString());
    if (query.limit) queryParams.append('limit', query.limit.toString());
    if (query.search) queryParams.append('search', query.search);
    if (query.sortBy) queryParams.append('sortBy', query.sortBy);
    if (query.sortOrder) queryParams.append('sortOrder', query.sortOrder);

    const endpoint = `/users/${userId}/products?${queryParams.toString()}`;
    const response = await apiService.get<ProductsResponse>(endpoint);
    
    if (response.success) {
      return response.data;
    } else {
      throw new Error(response.message || 'Failed to fetch user products');
    }
  }

  async getFavoriteProducts(query: ProductsQuery = {}): Promise<ProductsResponse> {
    const queryParams = new URLSearchParams();
    
    if (query.page) queryParams.append('page', query.page.toString());
    if (query.limit) queryParams.append('limit', query.limit.toString());

    const endpoint = `/users/favorites?${queryParams.toString()}`;
    const response = await apiService.get<ProductsResponse>(endpoint);
    
    if (response.success) {
      return response.data;
    } else {
      throw new Error(response.message || 'Failed to fetch favorite products');
    }
  }

  async addToFavorites(productId: string): Promise<void> {
    const response = await apiService.post(`/users/favorites/${productId}`, {});
    
    if (!response.success) {
      throw new Error(response.message || 'Failed to add to favorites');
    }
  }

  async removeFromFavorites(productId: string): Promise<void> {
    const response = await apiService.delete(`/users/favorites/${productId}`);
    
    if (!response.success) {
      throw new Error(response.message || 'Failed to remove from favorites');
    }
  }
}

export const productsService = new ProductsService();

export const getProducts = (token: string, query: ProductsQuery = {}) => productsService.getProducts(query);
export const fetchProductById = (productId: string) => productsService.getProductById(productId);
export const addProduct = (token: string, productData: ProductInput) => productsService.createProduct(productData);
export const updateProduct = (productId: string,  productData: Partial<ProductInput>) => 
  productsService.updateProduct(productId, productData);