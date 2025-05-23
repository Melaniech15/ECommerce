// src/types/index.ts

export interface Image {
  url: string;
  _id?: string;
}

export interface Product {
  _id: string;
  title: string;
  description: string;
  price: number;
  category: string;
  model: string;
  images: Image[];
  location: {
    latitude: number;
    longitude: number;
  };
  owner: {
    _id: string;
    name: string;
    email: string;
  };
}

export interface ProductInput {
  title: string;
  description: string;
  price: number;
  images: Image[];
  location?: {
    latitude: number;
    longitude: number;
  };
}
