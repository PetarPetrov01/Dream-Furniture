import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { signal } from '@angular/core';

import { HeaderComponent } from './header.component';
import { AuthService } from '../../shared/auth.service';
import { CartStore } from '../../auth/cart/cart.store';

describe('HeaderComponent', () => {
  let component: HeaderComponent;
  let fixture: ComponentFixture<HeaderComponent>;
  let authServiceMock: jasmine.SpyObj<AuthService>;
  let cartStoreMock: jasmine.SpyObj<CartStore>;

  beforeEach(async () => {
    authServiceMock = jasmine.createSpyObj(
      'AuthService',
      ['clearUserSession'],
      { isLogged: false }
    );
    cartStoreMock = jasmine.createSpyObj('CartStore', ['reset'], {
      totalCount: signal(0),
      items: signal([]),
      totalPrice: signal(0),
    });

    await TestBed.configureTestingModule({
      imports: [HeaderComponent, RouterTestingModule],
      providers: [
        { provide: CartStore, useValue: cartStoreMock },
        { provide: AuthService, useValue: authServiceMock },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(HeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should expose the cart total count signal from CartStore', () => {
    expect(component.cartQuantity()).toBe(0);
  });
});
