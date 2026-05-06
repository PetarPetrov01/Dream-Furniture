import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  OnInit,
  inject,
  signal,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute, RouterLink } from '@angular/router';

import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-not-found',
  imports: [MatButtonModule, RouterLink],
  templateUrl: './not-found.component.html',
  styleUrl: './not-found.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NotFoundComponent implements OnInit {
  private activated = inject(ActivatedRoute);
  private destroyRef = inject(DestroyRef);

  readonly productId = signal<string | null>(null);

  ngOnInit(): void {
    this.activated.url
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((url) => {
        if (url[0]?.path == 'products') {
          this.productId.set(url[1].path);
        }
      });
  }
}
