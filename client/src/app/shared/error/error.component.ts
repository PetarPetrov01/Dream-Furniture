import { Component, DestroyRef, OnInit, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ErrorService } from './error.service';

@Component({
    selector: 'app-error',
    imports: [],
    templateUrl: './error.component.html',
    styleUrl: './error.component.css'
})
export class ErrorComponent implements OnInit {
  private errorService = inject(ErrorService);
  private destroyRef = inject(DestroyRef);

  error: string | null = null;

  ngOnInit(): void {
    this.errorService.error$
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((err) => {
        this.error = err;
      });
  }
}
