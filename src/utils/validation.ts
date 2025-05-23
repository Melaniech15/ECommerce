import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export const signupSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  password: z.string().min(6),
  phone: z.string().min(10),
});

export const verificationSchema = z.object({
  code: z.string().length(4),
});

export const productSchema = z.object({
  title: z.string().min(3),
  description: z.string().min(10),
  price: z.number().min(1),
});
