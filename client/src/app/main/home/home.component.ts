import { Component, DestroyRef, OnInit, inject } from '@angular/core';
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
    styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit {
  private apiService = inject(ApiService);
  private destroyRef = inject(DestroyRef);

  products: APIProduct[] | [] = [];
  isLoading: boolean = false;

  ngOnInit(): void {
    this.isLoading = true;

    this.apiService
      .getProducts({ limit: 3, sort: 'createdAt:asc' })
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((products) => {
        setTimeout(() => {
          this.products = products;
          this.isLoading = false;
        }, 2000);
      });
  }
}
