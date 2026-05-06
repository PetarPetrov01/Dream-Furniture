import { Component, inject } from '@angular/core';
import { Location } from '@angular/common';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';

import { MatMenuModule } from '@angular/material/menu';
import { MatBadgeModule } from '@angular/material/badge';

import { AuthService } from '../../shared/auth.service';
import { CartStore } from '../../auth/cart/cart.store';

@Component({
    selector: 'app-header',
    imports: [RouterLink, RouterLinkActive, MatMenuModule, MatBadgeModule],
    templateUrl: './header.component.html',
    styleUrl: './header.component.css'
})
export class HeaderComponent {
  private router = inject(Router);
  private authService = inject(AuthService);
  private cartStore = inject(CartStore);
  location = inject(Location);

  readonly cartQuantity = this.cartStore.totalCount;

  get isLogged() {
    return this.authService.isLogged;
  }

  get isHomeActive() {
    return this.location.path().match(/\/home$/);
  }

  handleLogout() {
    this.authService.clearUserSession();
    this.router.navigate(['/']);
  }

  //To ensure visual indication on the parent anchor(dropdown)
  isProfileActive() {
    return this.router.url.includes('/profile');
  }
}
