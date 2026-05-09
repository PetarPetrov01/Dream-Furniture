import { Injectable, inject } from "@angular/core";
import { HttpClient, HttpParams } from "@angular/common/http";
import { Params } from "@angular/router";

import { APIProduct, PopulatedProduct, Product } from "../types/Product";
import { User } from "../types/User";

@Injectable({ providedIn: "root" })
export class ApiService {
  private http = inject(HttpClient);

  getProducts(params: Params) {
    let httpParams = new HttpParams();
    Object.entries(params).forEach(([k, v]) => {
      if (v === null || v === undefined || v === "") return;
      if (Array.isArray(v)) v.forEach((item) => (httpParams = httpParams.append(k, String(item))));
      else httpParams = httpParams.set(k, String(v));
    });
    return this.http.get<APIProduct[]>("/api/products", { params: httpParams });
  }

  getProduct(slugOrId: string) {
    return this.http.get<PopulatedProduct>(`/api/products/${slugOrId}`);
  }

  addProduct(data: Product) {
    return this.http.post<APIProduct>("/api/products", data);
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
