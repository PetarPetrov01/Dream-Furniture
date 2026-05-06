import { RouterTestingModule } from '@angular/router/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { NgZone } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

import { BehaviorSubject, of } from 'rxjs';

import { ProfileComponent } from './profile.component';
import { HomeComponent } from '../../main/home/home.component';

import { AuthService } from '../../shared/auth.service';

import { APIProduct } from '../../types/Product';

describe('ProfileComponent', () => {
  let component: ProfileComponent;
  let fixture: ComponentFixture<ProfileComponent>;
  let authServiceMock: jasmine.SpyObj<AuthService>;
  let matDialogMock: jasmine.SpyObj<MatDialog>;

  const userMock = {
    _id: '',
    username: '',
    email: '',
    password: '',
    wishlist: [],
  };

  const mockProduct: APIProduct = {
    _id: '123',
    name: '',
    description: '',
    image: '',
    category: [''],
    style: '',
    dimensions: {
      height: 1,
      width: 1,
      depth: 1,
    },
    material: [''],
    color: '',
    price: 1,
    __v: '1',
    _ownerId: '123',
    createdAt: '2024-03-10T11:27:12.452+00:00',
  };
  const productsMockSubject = new BehaviorSubject<APIProduct[]>([]);

  beforeEach(async () => {
    authServiceMock = jasmine.createSpyObj('AuthService', [
      'user$',
      'getOwnProducts',
      'clearUserSession',
    ]);
    matDialogMock = jasmine.createSpyObj('MatDialog', ['open']);

    await TestBed.configureTestingModule({
      imports: [
        ProfileComponent,
        CommonModule,
        RouterTestingModule.withRoutes([
          { path: '', component: HomeComponent },
        ]),
      ],
      providers: [
        { provide: AuthService, useValue: authServiceMock },
        { provide: MatDialog, useValue: matDialogMock },
      ],
    }).compileComponents();

    authServiceMock.user$ = of(userMock);
    authServiceMock.getOwnProducts.and.returnValue(
      productsMockSubject.asObservable()
    );

    fixture = TestBed.createComponent(ProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(true).toBeTruthy();
  });

  it('Should load the user', () => {
    expect(component.user).toEqual(userMock);
  });

  it('Products should be empty', () => {
    productsMockSubject.next([]);
    expect(component.products.length).toBeFalsy();
  });

  it('Should set all products', () => {
    productsMockSubject.next(new Array(3).fill(mockProduct));
    expect(component.products.length).toEqual(3);
    expect(component.products[0]).toEqual(mockProduct);
  });

  it('Should open modal on "edit profile" click', () => {
    component.onEditProfile();
    expect(matDialogMock.open).toHaveBeenCalled();
  });

  it('Should clear session on logout', () => {
    const ngZone = TestBed.inject(NgZone);
    ngZone.run(() => component.handleLogout());

    expect(authServiceMock.clearUserSession).toHaveBeenCalled();
  });

  it('Should navigate to home on logout', () => {
    const ngZone = TestBed.inject(NgZone);
    const routerMock = TestBed.inject(Router);
    spyOn(routerMock, 'navigate');

    ngZone.run(() => component.handleLogout());

    expect(routerMock.navigate).toHaveBeenCalledWith(['/']);
  });

  it('Should open modal on delete', () => {
    component.onDelete(mockProduct, '100', '100');
    expect(matDialogMock.open).toHaveBeenCalled();
  });
});
