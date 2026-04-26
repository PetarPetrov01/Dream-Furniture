import { Component, DestroyRef, OnInit, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Params, Router, RouterLink } from '@angular/router';

import { Subject, debounceTime } from 'rxjs';

import { ApiService } from '../../shared/api.service';
import { APIProduct } from '../../types/Product';
import { LoaderCardComponent } from '../../shared/loader-card/loader-card.component';

import { MatChipsModule } from '@angular/material/chips';
import { MatSliderModule } from '@angular/material/slider';

import { FormsModule } from '@angular/forms';
import { FloorPricePipe } from '../../shared/pipes/floor-price.pipe';
import { DecimalSlicePipe } from '../../shared/pipes/decimal-slice.pipe';

interface PriceRange {
  lower: number;
  upper: number;
}

@Component({
    selector: 'app-products',
    imports: [
        CommonModule,
        RouterLink,
        LoaderCardComponent,
        MatChipsModule,
        MatSliderModule,
        FormsModule,
        FloorPricePipe,
        DecimalSlicePipe,
    ],
    templateUrl: './products.component.html',
    styleUrl: './products.component.css'
})
export class ProductsComponent implements OnInit {
  private apiService = inject(ApiService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private destroyRef = inject(DestroyRef);

  products: APIProduct[] | [] = [];
  queryParams: Params = {};

  categoryChange$: Subject<string> = new Subject<string>();
  hasDebounced: boolean = false;

  isLoading: boolean = false;
  search: string = '';
  sort: string = '';
  priceRange: PriceRange = {
    lower: 30,
    upper: 380,
  };

  sortOptions = [
    {
      value: 'name:asc',
      text: 'Name (A to Z)',
    },
    {
      value: 'name:desc',
      text: 'Name (Z to A)',
    },
    {
      value: 'price:asc',
      text: 'Price ascending',
    },
    {
      value: 'price:desc',
      text: 'Price descending',
    },
    {
      value: 'createdAt:asc',
      text: 'Oldest first',
    },
    {
      value: 'createdAt desc',
      text: 'Newest first',
    },
  ];

  ngOnInit(): void {
    this.isLoading = true;

    this.categoryChange$
      .pipe(debounceTime(1000), takeUntilDestroyed(this.destroyRef))
      .subscribe(() => {
        this.fetchProducts();
      });

    this.route.queryParams
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((params) => {
        this.queryParams = params;
        this.sort = this.queryParams['sort'] || '';
        this.search = this.queryParams['search'] || '';

        if (!this.hasDebounced) {
          this.fetchProducts();
        }
      });
  }

  fetchProducts() {
    this.isLoading = true;
    this.apiService
      .getProducts(this.queryParams)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((prods) => {
        this.isLoading = false;
        this.products = prods;
      });
  }

  changeCategory(category: string) {
    if (category == this.queryParams['category']) {
      return;
    }

    const newCategory = category ? category : null;
    //If empty string is passed to the params, it still remains in the query, while passing null, complete removes it:
    //Passing '' => /products?category=
    //Passing null => /products

    this.hasDebounced = true;
    //For the initial click (while its still false)

    this.categoryChange$.next(newCategory || '');
    this.router.navigate(['/products'], {
      queryParams: { category: newCategory },
      queryParamsHandling: 'merge',
    });
  }

  onSearch() {
    let search;

    if (this.search) {
      search = this.search;
    } else if (this.queryParams['search']) {
      //   If the user has searched and clears the search
      search = null;
    } else {
      return;
    }

    this.hasDebounced = false;

    this.router.navigate(['/products'], {
      queryParams: { search },
      queryParamsHandling: 'merge',
    });
  }

  onSortChange() {
    this.hasDebounced = false;

    this.router.navigate(['/products'], {
      queryParams: { sort: this.sort },
      queryParamsHandling: 'merge',
    });
  }

  onClear() {
    if (Object.keys(this.queryParams).length < 1) {
      return;
    }

    this.hasDebounced = false;
    this.priceRange = {
      lower: 30,
      upper: 380,
    };
    this.router.navigate(['/products']);
  }

  onPriceChange(caller?: string | null) {
    if (this.priceRange.lower > this.priceRange.upper) {
      if (caller == 'lower') {
        this.priceRange.lower = this.priceRange.upper;
      }
      if (caller == 'upper') {
        this.priceRange.upper = this.priceRange.lower;
      }
      return;
    }

    this.router.navigate(['/products'], {
      queryParams: {
        priceRange: `${this.priceRange.lower}:${this.priceRange.upper}`,
      },
      queryParamsHandling: 'merge',
    });
  }

  get hasQueryParams() {
    return !!Object.keys(this.queryParams).length;
  }
}
