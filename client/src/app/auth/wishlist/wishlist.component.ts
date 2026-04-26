import { Component, DestroyRef, OnInit, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Router, RouterLink } from '@angular/router';

import { switchMap } from 'rxjs';
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
    imports: [RouterLink, FloorPricePipe, DecimalSlicePipe],
    templateUrl: './wishlist.component.html',
    styleUrl: './wishlist.component.css'
})
export class WishlistComponent implements OnInit {
  authService = inject(AuthService);
  apiService = inject(ApiService);
  store = inject(Store<CartState>);

  router = inject(Router);
  private destroyRef = inject(DestroyRef);

  wishlist: PopulatedProduct[] | [] = [];

  ngOnInit(): void {
    this.fetchWishList();
  }

  fetchWishList() {
    this.authService.getWishlist()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((wishlist) => {
        this.wishlist = wishlist;
      });
  }

  onRemove(prodId: string) {
    this.apiService.toggleWishList(prodId)
      .pipe(
        switchMap((user) => {
          // sync user
          this.authService.setUserStorage(user);
          this.authService.setUserSubject(user);
          // refetch list
          return this.authService.getWishlist();
        }),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe((wishlist) => {
        this.wishlist = wishlist;
      });
  }

  onAddToCart(product: PopulatedProduct) {
    this.store.dispatch(CartActions.addItem({ product, qty: 1 }));
  }
}
