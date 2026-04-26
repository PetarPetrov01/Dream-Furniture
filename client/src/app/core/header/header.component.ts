import { Component } from '@angular/core';
import { Location } from '@angular/common';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';

import { Store } from '@ngrx/store';

import { MatMenuModule } from '@angular/material/menu';
import { MatBadgeModule } from '@angular/material/badge';

import { AuthService } from '../../shared/auth.service';

import { CartState } from '../../types/State';

@Component({
    selector: 'app-header',
    imports: [RouterLink, RouterLinkActive, MatMenuModule, MatBadgeModule],
    templateUrl: './header.component.html',
    styleUrl: './header.component.css'
})
export class HeaderComponent {
  cartQuantity: number = 0;

  constructor(
    private router: Router,
    private authService: AuthService,
    private store: Store<CartState>,
    public location: Location
  ) {
    this.store.select('cart').subscribe((prods) => {
      this.cartQuantity = prods.reduce(
        (acc, prod) => (acc += prod.quantity),
        0
      );
    });
  }

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
