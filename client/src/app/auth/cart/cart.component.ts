import { Component, DestroyRef, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Router, RouterLink } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';

import { AuthService } from '../../shared/auth.service';
import { ApiService } from '../../shared/api.service';

import { FloorPricePipe } from '../../shared/pipes/floor-price.pipe';
import { DecimalSlicePipe } from '../../shared/pipes/decimal-slice.pipe';

import { RemoveDialogComponent } from './remove-dialog/remove-dialog.component';
import { ClearDialogComponent } from './clear-dialog/clear-dialog.component';

import { StateProduct } from '../../types/State';
import { CartStore } from './cart.store';
import { NotificationService } from '../../shared/notification/notification.service';
import { DIALOG_DEFAULTS } from '../../shared/ui-constants';

@Component({
    selector: 'app-cart',
    imports: [RouterLink, FloorPricePipe, DecimalSlicePipe],
    templateUrl: './cart.component.html',
    styleUrl: './cart.component.css'
})
export class CartComponent {
  private cartStore = inject(CartStore);
  private matDialog = inject(MatDialog);
  private authService = inject(AuthService);
  private apiService = inject(ApiService);
  private notificationService = inject(NotificationService);
  private router = inject(Router);
  private destroyRef = inject(DestroyRef);

  readonly products = this.cartStore.items;
  readonly totalCount = this.cartStore.totalCount;
  readonly totalPrice = this.cartStore.totalPrice;

  handleIncreaseQuantity(currentProduct: StateProduct) {
    this.cartStore.addItem(currentProduct, 1);
  }

  handleDecreaseQuantity(currentProduct: StateProduct) {
    if (currentProduct.quantity <= 1) {
      this.matDialog.open(RemoveDialogComponent, {
        ...DIALOG_DEFAULTS,
        data: {
          productName: currentProduct?.name,
          _id: currentProduct?._id,
        },
      });
    } else {
      this.cartStore.decrease(currentProduct._id);
    }
  }

  toggleWishlist(currentProduct: StateProduct) {
    this.apiService.toggleWishList(currentProduct._id)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((user) => {
        this.router.navigate([`/cart`]);
        this.authService.setUserStorage(user);
        this.authService.setUserSubject(user);
      });
  }

  handleRemove(currentProduct: StateProduct) {
    this.matDialog.open(RemoveDialogComponent, {
      ...DIALOG_DEFAULTS,
      data: {
        productName: currentProduct?.name,
        _id: currentProduct?._id,
      },
    });
  }

  handleClearCart() {
    this.matDialog.open(ClearDialogComponent, DIALOG_DEFAULTS);
  }

  handleCompleteOrder() {
    const items = this.products();
    if (items.length === 0) return;

    const order = items.map((prod) => ({
      product: prod._id,
      count: prod.quantity,
    }));

    this.authService
      .completeOrder(order)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((completed) => {
        this.cartStore.reset();
        this.notificationService.setNotification(
          `Your order №${completed._id.slice(-8)} has been approved.`
        );
      });
  }

  isInWishList(product: StateProduct) {
    return !!this.authService.user?.wishlist?.some(
      (prodId) => prodId == product._id
    );
  }
}
