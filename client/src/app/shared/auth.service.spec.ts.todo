import { TestBed } from '@angular/core/testing';
import { HttpClient } from '@angular/common/http';

import { EMPTY, of } from 'rxjs';
import { Store } from '@ngrx/store';

import { AuthService } from './auth.service';
import { User } from '../types/User';

describe('AuthService', () => {
  let service: AuthService;
  let httpMock: jasmine.SpyObj<HttpClient>;
  let storeMock: jasmine.SpyObj<Store>;

  beforeEach(() => {
    httpMock = jasmine.createSpyObj('HttpClient', ['post', 'get']);
    storeMock = jasmine.createSpyObj('Store', ['dispatch']);

    TestBed.configureTestingModule({
      imports: [],
      providers: [
        AuthService,
        { provide: Store, useValue: storeMock },
        { provide: HttpClient, useValue: httpMock },
      ],
    });

    service = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpClient) as jasmine.SpyObj<HttpClient>;
    storeMock = TestBed.inject(Store) as jasmine.SpyObj<Store>;
  });

  it('should return false when no user is logged in', () => {
    expect(service.isLogged).toBeFalsy();
  });

  it('should return true if the user is logged in', () => {
    const mockUser: User = {
      _id: '123',
      email: 'test@mail.com',
      username: 'Test1',
      wishlist: [],
    };
    service.setUserSubject(mockUser);
    expect(service.isLogged).toBeTruthy();
  });

  it('login should return the user and set the user', (done) => {
    const mockUser: User = {
      _id: '123',
      email: 'test@mail.com',
      username: 'Test1',
      wishlist: [],
    };

    httpMock.post
      .withArgs('/api/auth/login', {
        email: mockUser.email,
        password: '123123',
      })
      .and.returnValue(of(mockUser));

    service.login(mockUser.email, '123123').subscribe((user) => {
      expect(service.isLogged).toBeTruthy();
      expect(user).toEqual(mockUser);
      done();
    });
  });

  it('register should return the user and set the user', (done) => {
    const mockUser: User = {
      _id: '123',
      email: 'test@mail.com',
      username: 'Test1',
      wishlist: [],
    };

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

  it('logout should clear the user', () => {
    const mockUser: User = {
      _id: '123',
      email: 'test@mail.com',
      username: 'Test1',
      wishlist: [],
    };
    //Set a mock user
    service.setUserStorage(mockUser);
    service.setUserSubject(mockUser);

    httpMock.get.and.returnValue(EMPTY);
    service.clearUserSession();
    expect(service.isLogged).toBeFalsy();
  });
});
