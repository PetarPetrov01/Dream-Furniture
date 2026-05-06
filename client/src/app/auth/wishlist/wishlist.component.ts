import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  OnInit,
  inject,
  signal,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Router, RouterLink } from '@angular/router';

import { switchMap } from 'rxjs';

import { ApiService } from '../../shared/api.service';
import { AuthService } from '../../shared/auth.service';

import { FloorPricePipe } from '../../shared/pipes/floor-price.pipe';
import { DecimalSlicePipe } from '../../shared/pipes/decimal-slice.pipe';

import { PopulatedProduct } from '../../types/Product';
import { CartStore } from '../cart/cart.store';

@Component({
  selector: 'app-wishlist',
  imports: [RouterLink, FloorPricePipe, DecimalSlicePipe],
  templateUrl: './wishlist.component.html',
  styleUrl: './wishlist.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WishlistComponent implements OnInit {
  authService = inject(AuthService);
  apiService = inject(ApiService);
  private cartStore = inject(CartStore);

  router = inject(Router);
  private destroyRef = inject(DestroyRef);

  readonly wishlist = signal<PopulatedProduct[]>([]);

  ngOnInit(): void {
    this.fetchWishList();
  }

  fetchWishList() {
    this.authService
      .getWishlist()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((wishlist) => {
        this.wishlist.set(wishlist);
      });
  }

  onRemove(prodId: string) {
    this.apiService
      .toggleWishList(prodId)
      .pipe(
        switchMap((user) => {
          this.authService.setUserStorage(user);
          this.authService.setUserSubject(user);
          return this.authService.getWishlist();
        }),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe((wishlist) => {
        this.wishlist.set(wishlist);
      });
  }

  onAddToCart(product: PopulatedProduct) {
    this.cartStore.addItem(product, 1);
  }
}
