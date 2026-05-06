import { PopulatedProduct } from './Product';

export interface StateProduct extends PopulatedProduct {
  quantity: number;
}
