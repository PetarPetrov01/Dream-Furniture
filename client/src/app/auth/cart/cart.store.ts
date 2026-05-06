import { computed, Injectable } from '@angular/core';
import { PopulatedProduct } from '../../types/Product';
import { StateProduct } from '../../types/State';
import { localStorageSignal } from '../../shared/local-storage-signal';

@Injectable({ providedIn: 'root' })
export class CartStore {
  private readonly state = localStorageSignal<StateProduct[]>('cart', []);

  readonly items = this.state.asReadonly();
  readonly totalCount = computed(() =>
    this.items().reduce((acc, p) => acc + p.quantity, 0)
  );
  readonly totalPrice = computed(() =>
    this.items().reduce((acc, p) => acc + p.quantity * p.price, 0)
  );

  addItem(product: PopulatedProduct, qty: number): void {
    this.state.update((items) => {
      const existing = items.find((p) => p._id === product._id);
      if (existing) {
        return items.map((p) =>
          p._id === existing._id ? { ...p, quantity: p.quantity + qty } : p
        );
      }
      return [...items, { ...product, quantity: qty }];
    });
  }

  decrease(productId: string): void {
    this.state.update((items) =>
      items.map((p) =>
        p._id === productId ? { ...p, quantity: p.quantity - 1 } : p
      )
    );
  }

  remove(productId: string): void {
    this.state.update((items) => items.filter((p) => p._id !== productId));
  }

  reset(): void {
    this.state.set([]);
  }
}
