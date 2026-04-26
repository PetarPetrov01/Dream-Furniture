import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';

import { Subscription, tap } from 'rxjs';
import { Store } from '@ngrx/store';

import { ApiService } from '../../shared/api.service';
import { AuthService } from '../../shared/auth.service';
import { PopulatedProduct } from '../../types/Product';

import { CartComponent } from '../../auth/cart/cart.component';
import { DeleteDialogComponent } from '../../shared/delete-dialog/delete-dialog.component';

import { DateFormatterPipe } from '../../shared/pipes/date-formatter.pipe';
import { FloorPricePipe } from '../../shared/pipes/floor-price.pipe';
import { DecimalSlicePipe } from '../../shared/pipes/decimal-slice.pipe';

import * as CartActions from '../../auth/cart/cart.actions';
import { NotificationService } from '../../shared/notification/notification.service';

@Component({
    selector: 'app-product-details',
    imports: [
        CommonModule,
        FormsModule,
        RouterLink,
        DeleteDialogComponent,
        DateFormatterPipe,
        FloorPricePipe,
        DecimalSlicePipe,
    ],
    templateUrl: './product-details.component.html',
    styleUrl: './product-details.component.css'
})
export class ProductDetailsComponent implements OnInit, OnDestroy {
  product: PopulatedProduct | null = null;
  productId: string = '';
  subscription: Subscription | null = null;

  buyQty: number = 1;

  constructor(
    private activated: ActivatedRoute,
    private apiService: ApiService,
    private authService: AuthService,
    private notificaionService: NotificationService,
    private matDialog: MatDialog,
    private router: Router,
    private store: Store<CartComponent>
  ) {}

  ngOnInit(): void {
    this.activated.params.subscribe((params) => {
      this.productId = params['id'];
      this.subscription = this.apiService.getProduct(this.productId).subscribe({
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
    this.apiService.toggleWishList(this.productId).subscribe((user) => {
      this.router.navigate([`/products/${this.productId}`]);
      this.authService.setUserStorage(user);
      this.authService.setUserSubject(user);
    });
  }

  addToCart() {
    if (this.product) {
      this.store.dispatch(
        CartActions.addItem({ product: this.product, qty: this.buyQty })
      );
      this.notificaionService.setNotification(
        'Item added to cart successfully!'
      );
    } else {
      return;
    }
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

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }
}
