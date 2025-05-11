export interface Image {
  url: string;
  _id: string;
}

export interface Product {
  model: string;
  category: string;
  _id: string;
  title: string;
  description: string;
  price: number;
  images: Image[];
}