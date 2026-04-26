import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';

import { Subscription } from 'rxjs';
import { Store } from '@ngrx/store';

import { ApiService } from '../../shared/api.service';
import { AuthService } from '../../shared/auth.service';

import { FloorPricePipe } from '../../shared/pipes/floor-price.pipe';
import { DecimalSlicePipe } from '../../shared/pipes/decimal-slice.pipe';

import { PopulatedProduct } from '../../types/Product';
import { CartState } from '../../types/State';

import * as CartActions from '../cart/cart.actions';

@Component({
    selector: 'app-wishlist',
    imports: [CommonModule, RouterLink, FloorPricePipe, DecimalSlicePipe],
    templateUrl: './wishlist.component.html',
    styleUrl: './wishlist.component.css'
})
export class WishlistComponent implements OnInit, OnDestroy {
  authService = inject(AuthService);
  apiService = inject(ApiService);
  store = inject(Store<CartState>);

  router = inject(Router);

  subscription: Subscription | null = null;
  wishlist: PopulatedProduct[] | [] = [];

  ngOnInit(): void {
    this.subscription = this.fetchWishList();
  }

  fetchWishList() {
    return this.authService.getWishlist().subscribe((wishlist) => {
      this.wishlist = wishlist;
    });
  }

  onRemove(prodId: string) {
    this.apiService.toggleWishList(prodId).subscribe((user) => {
      //sync user
      this.authService.setUserStorage(user);
      this.authService.setUserSubject(user);

      //sync list
      this.subscription = this.fetchWishList();
    });
  }

  onAddToCart(product: PopulatedProduct) {
    this.store.dispatch(CartActions.addItem({ product, qty: 1 }));
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
}
