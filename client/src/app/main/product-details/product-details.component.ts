import { Component, DestroyRef, OnInit, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';

import { ApiService } from '../../shared/api.service';
import { AuthService } from '../../shared/auth.service';
import { PopulatedProduct } from '../../types/Product';

import { DeleteDialogComponent } from '../../shared/delete-dialog/delete-dialog.component';

import { DateFormatterPipe } from '../../shared/pipes/date-formatter.pipe';
import { FloorPricePipe } from '../../shared/pipes/floor-price.pipe';
import { DecimalSlicePipe } from '../../shared/pipes/decimal-slice.pipe';

import { CartStore } from '../../auth/cart/cart.store';
import { NotificationService } from '../../shared/notification/notification.service';

@Component({
    selector: 'app-product-details',
    imports: [
        CommonModule,
        FormsModule,
        RouterLink,
        DateFormatterPipe,
        FloorPricePipe,
        DecimalSlicePipe,
    ],
    templateUrl: './product-details.component.html',
    styleUrl: './product-details.component.css'
})
export class ProductDetailsComponent implements OnInit {
  private activated = inject(ActivatedRoute);
  private apiService = inject(ApiService);
  private authService = inject(AuthService);
  private notificaionService = inject(NotificationService);
  private matDialog = inject(MatDialog);
  private router = inject(Router);
  private cartStore = inject(CartStore);
  private destroyRef = inject(DestroyRef);

  product: PopulatedProduct | null = null;
  productId: string = '';

  buyQty: number = 1;

  ngOnInit(): void {
    this.activated.params
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((params) => {
        this.productId = params['id'];
        this.apiService.getProduct(this.productId)
          .pipe(takeUntilDestroyed(this.destroyRef))
          .subscribe({
            next: (prod) => {
              this.product = prod;
            },
            error: () => {
              this.router.navigate([`/products/${this.productId}/not-found`]);
            },
          });
      });
  }

  get isUser() {
    return this.authService.isLogged;
  }

  get isOwner() {
    return this.product?._ownerId._id == this.authService.user?._id;
  }

  get isInWishList() {
    return this.authService.user?.wishlist.some(
      (prodId) => prodId == this.productId
    );
  }

  monthlyPrice(price: number | undefined): string {
    const promotion = 0.05;
    const monthly = Number(price) / 12;
    return (monthly * (1 - promotion)).toFixed(2);
  }

  addQty() {
    if (this.buyQty >= 50) {
      return;
    }
    this.buyQty += 1;
  }

  removeQty() {
    if (this.buyQty <= 1) {
      return;
    }
    this.buyQty -= 1;
  }

  toggleWishlist() {
    this.apiService.toggleWishList(this.productId)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((user) => {
        this.router.navigate([`/products/${this.productId}`]);
        this.authService.setUserStorage(user);
        this.authService.setUserSubject(user);
      });
  }

  addToCart() {
    if (!this.product) return;
    this.cartStore.addItem(this.product, this.buyQty);
    this.notificaionService.setNotification(
      'Item added to cart successfully!'
    );
  }

  onInputBlur() {
    if (
      !this.buyQty ||
      this.buyQty < 1 ||
      this.buyQty > 50 ||
      Number.isInteger(this.buyQty) == false
    ) {
      this.buyQty = 1;
    }
  }

  onDelete(enterAnimationDuration: string, exitAnimationDuration: string) {
    this.matDialog.open(DeleteDialogComponent, {
      width: '300px',
      enterAnimationDuration,
      exitAnimationDuration,
      data: {
        productName: this.product?.name,
        _id: this.product?._id,
      },
    });
  }
}
