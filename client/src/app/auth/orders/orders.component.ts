import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  OnInit,
  inject,
  signal,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';

import { AuthService } from '../../shared/auth.service';

import { DateFormatterPipe } from '../../shared/pipes/date-formatter.pipe';
import { DecimalSlicePipe } from '../../shared/pipes/decimal-slice.pipe';
import { FloorPricePipe } from '../../shared/pipes/floor-price.pipe';

import { APIOrder } from '../../types/Order';

@Component({
  selector: 'app-orders',
  imports: [
    CommonModule,
    DateFormatterPipe,
    FloorPricePipe,
    DecimalSlicePipe,
    RouterLink,
  ],
  templateUrl: './orders.component.html',
  styleUrl: './orders.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OrdersComponent implements OnInit {
  readonly orders = signal<APIOrder[]>([]);

  authService = inject(AuthService);
  router = inject(Router);
  private destroyRef = inject(DestroyRef);

  ngOnInit(): void {
    this.fetchOrders();
  }

  fetchOrders() {
    this.authService
      .getOrders()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((orders) => {
        this.orders.set(orders);
      });
  }

  handleDelete(orderId: string) {
    this.authService
      .deleteOrder(orderId)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => {
        this.fetchOrders();
      });
  }
}
