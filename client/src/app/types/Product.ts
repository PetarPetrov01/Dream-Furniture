import { User } from "./User";

export interface Product {
  name: string;
  description: string;
  shortDescription: string;
  images: string[];
  category: string[];
  style: string;
  dimensions: { height: number; width: number; depth: number };
  material: string[];
  color: string;
  price: number;
  tags?: string[];
  inStock?: boolean;
}

export interface APIProduct extends Product {
  _id: string;
  slug: string;
  isFeatured: boolean;
  inStock: boolean;
  tags: string[];
  _ownerId: string;
  __v: string;
  createdAt: string;
}

export interface PopulatedProduct extends Omit<APIProduct, "_ownerId"> {
  _ownerId: User;
}
