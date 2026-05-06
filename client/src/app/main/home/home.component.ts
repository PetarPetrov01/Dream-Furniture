import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  OnInit,
  inject,
  signal,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ApiService } from '../../shared/api.service';
import { APIProduct } from '../../types/Product';

import { RouterLink } from '@angular/router';
import { LoaderCardComponent } from '../../shared/loader-card/loader-card.component';
import { FloorPricePipe } from '../../shared/pipes/floor-price.pipe';
import { DecimalSlicePipe } from '../../shared/pipes/decimal-slice.pipe';

@Component({
  selector: 'app-home',
  imports: [RouterLink, LoaderCardComponent, FloorPricePipe, DecimalSlicePipe],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeComponent implements OnInit {
  private apiService = inject(ApiService);
  private destroyRef = inject(DestroyRef);

  readonly products = signal<APIProduct[]>([]);
  readonly isLoading = signal(false);

  ngOnInit(): void {
    this.isLoading.set(true);

    this.apiService
      .getProducts({ limit: 3, sort: 'createdAt:asc' })
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((products) => {
        setTimeout(() => {
          this.products.set(products);
          this.isLoading.set(false);
        }, 2000);
      });
  }
}
