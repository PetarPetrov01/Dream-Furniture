import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Params } from '@angular/router';

import { tap } from 'rxjs';

import { APIProduct, PopulatedProduct, Product } from '../types/Product';
import { User } from '../types/User';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private http = inject(HttpClient);


  getProducts(params: Params) {
    return this.http.get<APIProduct[]>('/api/products', { params });
  }

  getProduct(productId: string) {
    return this.http
      .get<PopulatedProduct>(`/api/products/${productId}`)
      .pipe(tap((res) => {}));
  }

  addProduct(data: Product) {
    return this.http.post<APIProduct>('/api/products', data);
  }

  updateProduct(productId: string, data: Product) {
    return this.http.put<APIProduct>(`/api/products/${productId}`, data);
  }

  deleteProduct(productId: string) {
    return this.http.delete(`/api/products/${productId}`);
  }

  toggleWishList(productId: string) {
    return this.http.post<User>(`/api/products/${productId}/wishlist`, {});
  }
}
