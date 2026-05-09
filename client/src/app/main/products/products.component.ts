import { ChangeDetectionStrategy, Component, DestroyRef, OnInit, computed, inject, signal } from "@angular/core";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { ActivatedRoute, Params, Router } from "@angular/router";

import { ApiService } from "../../shared/api.service";
import { APIProduct } from "../../types/Product";
import { LoaderCardComponent } from "../../shared/loader-card/loader-card.component";
import { ProductCardComponent } from "./product-card/product-card.component";
import { FilterRailComponent, FilterState } from "./filter-rail/filter-rail.component";
import { SortSearchBarComponent } from "./sort-search-bar/sort-search-bar.component";
import { SectionHeadingComponent } from "../../shared/ui/section-heading/section-heading.component";

const PAGE_SIZE = 12;

@Component({
  selector: "app-products",
  imports: [
    LoaderCardComponent,
    ProductCardComponent,
    FilterRailComponent,
    SortSearchBarComponent,
    SectionHeadingComponent,
  ],
  templateUrl: "./products.component.html",
  styleUrl: "./products.component.css",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductsComponent implements OnInit {
  private apiService = inject(ApiService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private destroyRef = inject(DestroyRef);

  readonly products = signal<APIProduct[]>([]);
  readonly isLoading = signal(false);
  readonly isLoadingMore = signal(false);
  readonly hasMore = signal(true);
  readonly error = signal(false);
  readonly queryParams = signal<Params>({});
  readonly hasQueryParams = computed(() => Object.keys(this.queryParams()).length > 0);
  readonly filterState = computed<FilterState>(() => {
    const q = this.queryParams();
    const cats = q["category"] ? (Array.isArray(q["category"]) ? q["category"] : [q["category"]]) : [];
    const [pmin, pmax] = (q["priceRange"] || "0:5000").split(":").map((n: string) => Number(n));
    return { categories: cats, priceMin: pmin || 0, priceMax: pmax || 5000 };
  });

  ngOnInit(): void {
    this.route.queryParams
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((p) => {
        this.queryParams.set(p);
        this.fetch(true);
      });
  }

  fetch(reset: boolean) {
    const q = { ...this.queryParams(), limit: PAGE_SIZE, offset: reset ? 0 : this.products().length };
    reset ? this.isLoading.set(true) : this.isLoadingMore.set(true);
    this.error.set(false);
    this.apiService.getProducts(q).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (page) => {
        this.products.update((curr) => (reset ? page : [...curr, ...page]));
        this.hasMore.set(page.length === PAGE_SIZE);
        this.isLoading.set(false);
        this.isLoadingMore.set(false);
      },
      error: () => {
        this.error.set(true);
        this.isLoading.set(false);
        this.isLoadingMore.set(false);
      },
    });
  }

  onFilterChange(state: FilterState) {
    const queryParams: Params = {
      category: state.categories.length ? state.categories : null,
      priceRange: state.priceMin || state.priceMax !== 5000 ? `${state.priceMin}:${state.priceMax}` : null,
    };
    this.router.navigate(["/products"], { queryParams, queryParamsHandling: "merge" });
  }

  onSearch(value: string) {
    this.router.navigate(["/products"], {
      queryParams: { search: value || null },
      queryParamsHandling: "merge",
    });
  }

  onSortChange(value: string) {
    this.router.navigate(["/products"], {
      queryParams: { sort: value || null },
      queryParamsHandling: "merge",
    });
  }

  onReset() {
    this.router.navigate(["/products"]);
  }

  loadMore() { this.fetch(false); }

  retry() { this.fetch(true); }
}
