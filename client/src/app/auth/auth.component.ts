import { ChangeDetectionStrategy, Component, OnInit, inject } from '@angular/core';

import { CookieService } from 'ngx-cookie-service';
import { AuthService } from '../shared/auth.service';

export const cookieName = 'auth-cookie';

@Component({
  selector: 'app-auth',
  imports: [],
  templateUrl: './auth.component.html',
  styleUrl: './auth.component.css',
  providers: [CookieService],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AuthComponent implements OnInit {
  private cookieService = inject(CookieService);
  private authService = inject(AuthService);

  ngOnInit(): void {
    const user = this.authService.getUserStorage();
    const authCookie = this.cookieService.get(cookieName);

    if (user && authCookie) {
      // both credentials intact
      this.authService.setUserSubject(user);
    } else if (authCookie) {
      // no user in storage, but token is intact — verify
      this.authService.getProfile();
    } else {
      // cookie missing — wipe session
      this.authService.clearUserSession();
    }
  }
}
