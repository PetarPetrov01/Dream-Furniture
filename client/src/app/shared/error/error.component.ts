import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  OnInit,
  inject,
  signal,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ErrorService } from './error.service';

@Component({
  selector: 'app-error',
  imports: [],
  templateUrl: './error.component.html',
  styleUrl: './error.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ErrorComponent implements OnInit {
  private errorService = inject(ErrorService);
  private destroyRef = inject(DestroyRef);

  readonly error = signal<string | null>(null);

  ngOnInit(): void {
    this.errorService.error$
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((err) => {
        this.error.set(err);
      });
  }
}
