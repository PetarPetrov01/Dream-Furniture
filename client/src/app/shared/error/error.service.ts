import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { ERROR_TIMEOUT_MS } from '../ui-constants';

@Injectable({
  providedIn: 'root',
})
export class ErrorService {
  apiError$$ = new BehaviorSubject<null | string>(null);
  error$ = this.apiError$$.asObservable();

  setError(err: string) {
    this.apiError$$.next(err);

    setTimeout(() => {
      this.clearError();
    }, ERROR_TIMEOUT_MS);
  }

  clearError() {
    this.apiError$$.next(null);
  }
}
