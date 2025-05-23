import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const BASE_URL = 'https://backend-practice.eurisko.me';
interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

class ApiService {
  private async getAuthToken(): Promise<string | null> {
    return await AsyncStorage.getItem('auth_token');
  }

  private async getRefreshToken(): Promise<string | null> {
    return await AsyncStorage.getItem('refresh_token');
  }

  private async setTokens(authToken: string, refreshToken: string) {
    await AsyncStorage.setItem('auth_token', authToken);
    await AsyncStorage.setItem('refresh_token', refreshToken);
  }

  private async removeTokens() {
    await AsyncStorage.removeItem('auth_token');
    await AsyncStorage.removeItem('refresh_token');
  }

  private async refreshAuthToken(): Promise<boolean> {
    try {
      const refreshToken = await this.getRefreshToken();
      if (!refreshToken) return false;

      const response = await fetch(`${BASE_URL}/auth/refresh`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ refreshToken }),
      });

      if (response.ok) {
        const data = await response.json();
        await this.setTokens(data.accessToken, data.refreshToken);
        return true;
      }
      
      return false;
    } catch (error) {
      return false;
    }
  }

  async request<T>(
    endpoint: string,
    options: RequestInit = {},
    requiresAuth: boolean = true
  ): Promise<ApiResponse<T>> {
    let token = requiresAuth ? await this.getAuthToken() : null;

    const config: RequestInit = {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
      },
    };

    try {
      let response = await fetch(`${BASE_URL}${endpoint}`, config);

      // If unauthorized and we have auth, try to refresh token
      if (response.status === 401 && requiresAuth) {
        const refreshed = await this.refreshAuthToken();
        if (refreshed) {
          token = await this.getAuthToken();
          config.headers = {
            ...config.headers,
            Authorization: `Bearer ${token}`,
          };
          response = await fetch(`${BASE_URL}${endpoint}`, config);
        }
      }

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'API request failed');
      }

      return {
        success: true,
        data: data.data || data,
        message: data.message,
      };
    } catch (error) {
      return {
        success: false,
        data: null as T,
        message: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  async get<T>(endpoint: string, requiresAuth: boolean = true): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: 'GET' }, requiresAuth);
  }

  async post<T>(
    endpoint: string, 
    data: any, 
    requiresAuth: boolean = true
  ): Promise<ApiResponse<T>> {
    return this.request<T>(
      endpoint,
      {
        method: 'POST',
        body: JSON.stringify(data),
      },
      requiresAuth
    );
  }

  async put<T>(
    endpoint: string, 
    data: any, 
    requiresAuth: boolean = true
  ): Promise<ApiResponse<T>> {
    return this.request<T>(
      endpoint,
      {
        method: 'PUT',
        body: JSON.stringify(data),
      },
      requiresAuth
    );
  }

  async delete<T>(endpoint: string, requiresAuth: boolean = true): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: 'DELETE' }, requiresAuth);
  }

  async uploadFormData<T>(
    endpoint: string,
    formData: FormData,
    requiresAuth: boolean = true
  ): Promise<ApiResponse<T>> {
    let token = requiresAuth ? await this.getAuthToken() : null;

    const config: RequestInit = {
      method: 'POST',
      body: formData,
      headers: {
        ...(token && { Authorization: `Bearer ${token}` }),
      },
    };

    try {
      let response = await fetch(`${BASE_URL}${endpoint}`, config);

      if (response.status === 401 && requiresAuth) {
        const refreshed = await this.refreshAuthToken();
        if (refreshed) {
          token = await this.getAuthToken();
          config.headers = {
            ...config.headers,
            Authorization: `Bearer ${token}`,
          };
          response = await fetch(`${BASE_URL}${endpoint}`, config);
        }
      }

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Upload failed');
      }

      return {
        success: true,
        data: data.data || data,
        message: data.message,
      };
    } catch (error) {
      return {
        success: false,
        data: null as T,
        message: error instanceof Error ? error.message : 'Upload failed',
      };
    }
  }

  async clearTokens() {
    await this.removeTokens();
  }
}

export const apiService = new ApiService();