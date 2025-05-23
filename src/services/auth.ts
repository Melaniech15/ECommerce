import AsyncStorage from '@react-native-async-storage/async-storage';
import { api } from './api';

export interface LoginData {
  email: string;
  password: string;
}

export interface SignupData {
  name: string;
  email: string;
  password: string;
  phone: string;
}

export interface OTPData {
  code: string;
}

export interface User {
  _id: string;
  name: string;
  email: string;
  phone: string;
  image?: string;
}

export const login = async (data: LoginData) => {
  const res = await api.post('/auth/login', data);
  const { accessToken } = res.data.data;
  await AsyncStorage.setItem('accessToken', accessToken);
  return res.data.data;
};

export const signup = async (data: SignupData) => {
  return api.post('/auth/signup', data);
};

export const verifyOTP = async (data: OTPData) => {
  return api.post('/auth/verify', data);
};

export const getProfile = async () => {
  const res = await api.get('/auth/me');
  return res.data.data;
};

export const updateProfile = async (data: Partial<User>) => {
  const res = await api.patch('/auth/me', data);
  return res.data.data;
};

export const logout = async () => {
  await AsyncStorage.removeItem('accessToken');
};
