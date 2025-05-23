import { apiService } from './api';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface SignupData {
  name: string;
  email: string;
  password: string;
  phone: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface AuthResponse {
  token: null;
  user: {
    id: string;
    name: string;
    email: string;
    phone: string;
    profileImage?: string;
  };
  accessToken: string;
  refreshToken: string;
}

export interface OTPVerificationData {
  email: string;
  otp: string;
}

class AuthService {
  getToken() {
    throw new Error('Method not implemented.');
  }
  async signup(data: SignupData) {
    const response = await apiService.post<AuthResponse>('/auth/signup', data, false);
    
    if (response.success && response.data) {
      await AsyncStorage.setItem('auth_token', response.data.accessToken);
      await AsyncStorage.setItem('refresh_token', response.data.refreshToken);
      await AsyncStorage.setItem('user_data', JSON.stringify(response.data.user));
    }
    
    return response;
  }

  async login(data: LoginData) {
    const response = await apiService.post<AuthResponse>('/auth/login', data, false);
    
    if (response.success && response.data) {
      await AsyncStorage.setItem('auth_token', response.data.accessToken);
      await AsyncStorage.setItem('refresh_token', response.data.refreshToken);
      await AsyncStorage.setItem('user_data', JSON.stringify(response.data.user));
    }
    
    return response;
  }

  async verifyOTP(data: OTPVerificationData) {
    const response = await apiService.post<AuthResponse>('/auth/verify-otp', data, false);
    
    if (response.success && response.data) {
      await AsyncStorage.setItem('auth_token', response.data.accessToken);
      await AsyncStorage.setItem('refresh_token', response.data.refreshToken);
      await AsyncStorage.setItem('user_data', JSON.stringify(response.data.user));
    }
    
    return response;
  }

  async logout() {
    try {
      await apiService.post('/auth/logout', {});
    } catch (error) {
      console.log('Logout API call failed:', error);
    } finally {
      await AsyncStorage.removeItem('auth_token');
      await AsyncStorage.removeItem('refresh_token');
      await AsyncStorage.removeItem('user_data');
      await apiService.clearTokens();
    }
  }

  async getCurrentUser() {
    try {
      const userData = await AsyncStorage.getItem('user_data');
      return userData ? JSON.parse(userData) : null;
    } catch (error) {
      return null;
    }
  }

  async isLoggedIn(): Promise<boolean> {
    const token = await AsyncStorage.getItem('auth_token');
    return !!token;
  }

  async resendOTP(email: string) {
    return await apiService.post('/auth/resend-otp', { email }, false);
  }

  async forgotPassword(email: string) {
    return await apiService.post('/auth/forgot-password', { email }, false);
  }

  async resetPassword(data: { email: string; otp: string; newPassword: string }) {
    return await apiService.post('/auth/reset-password', data, false);
  }
}

export const authService = new AuthService();