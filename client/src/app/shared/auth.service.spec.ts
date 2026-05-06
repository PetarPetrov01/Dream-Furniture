import { TestBed } from '@angular/core/testing';
import { HttpClient } from '@angular/common/http';

import { EMPTY, of } from 'rxjs';

import { AuthService } from './auth.service';
import { CartStore } from '../auth/cart/cart.store';
import { User } from '../types/User';

describe('AuthService', () => {
  let service: AuthService;
  let httpMock: jasmine.SpyObj<HttpClient>;
  let cartStoreMock: jasmine.SpyObj<CartStore>;

  const mockUser: User = {
    _id: '123',
    email: 'test@mail.com',
    username: 'Test1',
    wishlist: [],
  };

  beforeEach(() => {
    httpMock = jasmine.createSpyObj('HttpClient', ['post', 'get']);
    cartStoreMock = jasmine.createSpyObj('CartStore', ['reset']);

    TestBed.configureTestingModule({
      providers: [
        AuthService,
        { provide: HttpClient, useValue: httpMock },
        { provide: CartStore, useValue: cartStoreMock },
      ],
    });

    service = TestBed.inject(AuthService);
  });

  it('should return false when no user is logged in', () => {
    expect(service.isLogged).toBeFalsy();
  });

  it('should return true if the user is logged in', () => {
    service.setUserSubject(mockUser);
    expect(service.isLogged).toBeTruthy();
  });

  it('login should return the user and set the user', (done) => {
    httpMock.post
      .withArgs('/api/auth/login', { email: mockUser.email, password: '123123' })
      .and.returnValue(of(mockUser));

    service.login(mockUser.email, '123123').subscribe((user) => {
      expect(service.isLogged).toBeTruthy();
      expect(user).toEqual(mockUser);
      done();
    });
  });

  it('register should return the user and set the user', (done) => {
    httpMock.post
      .withArgs('/api/auth/register', {
        email: mockUser.email,
        username: mockUser.username,
        password: '123123',
      })
      .and.returnValue(of(mockUser));

    service
      .register(mockUser.email, mockUser.username, '123123')
      .subscribe((user) => {
        expect(service.isLogged).toBeTruthy();
        expect(user).toEqual(mockUser);
        done();
      });
  });

  it('logout should clear the user and reset the cart store', () => {
    service.setUserStorage(mockUser);
    service.setUserSubject(mockUser);
    httpMock.get.and.returnValue(EMPTY);

    service.clearUserSession();

    expect(service.isLogged).toBeFalsy();
    expect(cartStoreMock.reset).toHaveBeenCalled();
  });
});
