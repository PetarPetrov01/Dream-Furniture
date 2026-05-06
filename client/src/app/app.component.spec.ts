import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { signal } from '@angular/core';

import { AppComponent } from './app.component';
import { AuthService } from './shared/auth.service';
import { CartStore } from './auth/cart/cart.store';

describe('AppComponent', () => {
  let authServiceMock: jasmine.SpyObj<AuthService>;
  let cartStoreMock: jasmine.SpyObj<CartStore>;

  beforeEach(async () => {
    authServiceMock = jasmine.createSpyObj('AuthService', [
      'getUserStorage',
      'clearUserSession',
    ]);
    cartStoreMock = jasmine.createSpyObj(
      'CartStore',
      ['addItem', 'decrease', 'remove', 'reset'],
      {
        items: signal([]),
        totalCount: signal(0),
        totalPrice: signal(0),
      }
    );

    await TestBed.configureTestingModule({
      imports: [AppComponent, RouterTestingModule],
      providers: [
        { provide: AuthService, useValue: authServiceMock },
        { provide: CartStore, useValue: cartStoreMock },
      ],
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it("should have the 'dreamFurniture' title", () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app.title).toEqual('dreamFurniture');
  });
});
