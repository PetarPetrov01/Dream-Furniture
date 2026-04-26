import { Component, OnInit, inject } from '@angular/core';

import { CookieService } from 'ngx-cookie-service';
import { AuthService } from '../shared/auth.service';

export const cookieName = 'auth-cookie';

@Component({
    selector: 'app-auth',
    imports: [],
    templateUrl: './auth.component.html',
    styleUrl: './auth.component.css',
    providers: [CookieService]
})
export class AuthComponent implements OnInit {
  private cookieService = inject(CookieService);
  private authService = inject(AuthService);

  ngOnInit(): void {
    const user = this.authService.getUserStorage();
    const authCookie = this.cookieService.get(cookieName);

    if (user && authCookie) {
      //Both credentials intact

      this.authService.setUserSubject(user);
    } else if (authCookie) {
      //No user in the storage, but token is intact, needs to be verified

      this.authService.getProfile();
    } else {
      //Either the cookie is missing or both are missing

      this.authService.clearUserSession();
    }
  }
}
