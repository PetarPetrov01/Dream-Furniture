import { ChangeDetectionStrategy, Component, DestroyRef, OnInit, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ApiService } from '../../shared/api.service';
import { APIProduct } from '../../types/Product';

import { HeroComponent } from './sections/hero/hero.component';
import { FeaturedCollectionComponent } from './sections/featured-collection/featured-collection.component';
import { CategoryGridComponent } from './sections/category-grid/category-grid.component';
import { NewArrivalsComponent } from './sections/new-arrivals/new-arrivals.component';
import { CraftsmanshipComponent } from './sections/craftsmanship/craftsmanship.component';
import { NewsletterComponent } from './sections/newsletter/newsletter.component';

@Component({
  selector: 'app-home',
  imports: [
    HeroComponent,
    FeaturedCollectionComponent,
    CategoryGridComponent,
    NewArrivalsComponent,
    CraftsmanshipComponent,
    NewsletterComponent,
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeComponent implements OnInit {
  private apiService = inject(ApiService);
  private destroyRef = inject(DestroyRef);

  readonly featured = signal<APIProduct[]>([]);
  readonly featuredLoading = signal(true);
  readonly featuredError = signal(false);

  readonly arrivals = signal<APIProduct[]>([]);
  readonly arrivalsLoading = signal(true);
  readonly arrivalsError = signal(false);

  ngOnInit(): void {
    this.apiService
      .getProducts({ isFeatured: 'true', limit: 3 })
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (p) => { this.featured.set(p); this.featuredLoading.set(false); },
        error: () => { this.featuredError.set(true); this.featuredLoading.set(false); },
      });

    this.apiService
      .getProducts({ sort: 'createdAt:desc', limit: 8 })
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (p) => { this.arrivals.set(p); this.arrivalsLoading.set(false); },
        error: () => { this.arrivalsError.set(true); this.arrivalsLoading.set(false); },
      });
  }
}
