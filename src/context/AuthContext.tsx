import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService, SignupData, LoginData, OTPVerificationData } from '../services/auth';

interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  profileImage?: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  token: string | null;
  login: (data: LoginData) => Promise<{ success: boolean; message?: string }>;
  signup: (data: SignupData) => Promise<{ success: boolean; message?: string }>;
  verifyOTP: (data: OTPVerificationData) => Promise<{ success: boolean; message?: string }>;
  logout: () => Promise<void>;
  updateUser: (userData: Partial<User>) => void;
  resendOTP: (email: string) => Promise<{ success: boolean; message?: string }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const isLoggedIn = await authService.isLoggedIn();
      if (isLoggedIn) {
        const userData = await authService.getCurrentUser();
        const userToken = await authService.getToken();
        if (userData && userToken) {
          setUser(userData);
          setToken(userToken);
          setIsAuthenticated(true);
        }
      }
    } catch (error) {
      console.log('Auth check failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (data: LoginData) => {
    try {
      const response = await authService.login(data);

      if (response.success && response.data) {
        setUser(response.data.user);
        setToken(response.data.token || null);
        setIsAuthenticated(true);
        return { success: true };
      } else {
        return { success: false, message: response.message || 'Login failed' };
      }
    } catch (error) {
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Login failed'
      };
    }
  };

  const signup = async (data: SignupData) => {
    try {
      const response = await authService.signup(data);

      if (response.success) {
        return { success: true };
      } else {
        return { success: false, message: response.message || 'Signup failed' };
      }
    } catch (error) {
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Signup failed'
      };
    }
  };

  const verifyOTP = async (data: OTPVerificationData) => {
    try {
      const response = await authService.verifyOTP(data);

      if (response.success && response.data) {
        setUser(response.data.user);
        setToken(response.data.token || null);
        setIsAuthenticated(true);
        return { success: true };
      } else {
        return { success: false, message: response.message || 'OTP verification failed' };
      }
    } catch (error) {
      return {
        success: false,
        message: error instanceof Error ? error.message : 'OTP verification failed'
      };
    }
  };

  const logout = async () => {
    try {
      await authService.logout();
    } catch (error) {
      console.log('Logout error:', error);
    } finally {
      setUser(null);
      setToken(null);
      setIsAuthenticated(false);
    }
  };

  const updateUser = (userData: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...userData };
      setUser(updatedUser);
    }
  };

  const resendOTP = async (email: string) => {
    try {
      const response = await authService.resendOTP(email);
      return {
        success: response.success,
        message: response.message || (response.success ? 'OTP sent successfully' : 'Failed to send OTP')
      };
    } catch (error) {
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Failed to send OTP'
      };
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      isAuthenticated,
      isLoading,
      token,
      login,
      signup,
      verifyOTP,
      logout,
      updateUser,
      resendOTP
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
