// src/services/products.ts
import { api } from './api';
import { ProductInput } from '../types/index';

export const getProducts = async ({
  page = 1,
  search = '',
  sort = 'createdAt:desc',
}: {
  page?: number;
  search?: string;
  sort?: string;
}) => {
  const res = await api.get(`/products?page=${page}&search=${search}&sortBy=${sort}`);
  return res.data;
};

export const getProductById = async (id: string) => {
  const res = await api.get(`/products/${id}`);
  return res.data;
};

export const createProduct = async (data: ProductInput) => {
  const res = await api.post('/products', data);
  return res.data;
};

export const updateProduct = async (id: string, data: ProductInput) => {
  const res = await api.patch(`/products/${id}`, data);
  return res.data;
};

export const deleteProduct = async (id: string) => {
  const res = await api.delete(`/products/${id}`);
  return res.data;
};
