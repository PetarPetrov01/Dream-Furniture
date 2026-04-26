import { Injectable, Provider, inject } from '@angular/core';
import { HTTP_INTERCEPTORS, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Router } from '@angular/router';

import { Observable, catchError, throwError } from 'rxjs';

import { AuthService } from './shared/auth.service';
import { environment } from '../environments/environment';
import { ErrorService } from './shared/error/error.service';

const { appUrl } = environment;

@Injectable()
export class AppInterceptor implements HttpInterceptor {
  private authService = inject(AuthService);
  private router = inject(Router);
  private errorService = inject(ErrorService);


  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    req = req.clone({
      url: req.url.replace('/api', appUrl),
      withCredentials: true,
    });

    return next.handle(req).pipe(
      catchError((err) => {
        if (err.status === 401) {
          this.authService.clearUserSession();
          this.router.navigate(['/auth/login']);
          return throwError(() => err);
        }
        if (!req.url.match(/\/products\/.+/)) {
          this.errorService.setError(err.error?.message ?? 'Unknown error');
        }
        return throwError(() => err);
      })
    );
  }
}

export const appInterceptorProvider: Provider = {
  provide: HTTP_INTERCEPTORS,
  useClass: AppInterceptor,
  multi: true,
};
