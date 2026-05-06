import { CommonModule } from '@angular/common';
import { NgZone } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { MatDialog } from '@angular/material/dialog';

import { BehaviorSubject, of } from 'rxjs';

import { ProfileComponent } from './profile.component';
import { HomeComponent } from '../../main/home/home.component';
import { AuthService } from '../../shared/auth.service';
import { APIProduct } from '../../types/Product';
import { User } from '../../types/User';

describe('ProfileComponent', () => {
  let component: ProfileComponent;
  let fixture: ComponentFixture<ProfileComponent>;
  let authServiceMock: jasmine.SpyObj<AuthService>;
  let matDialogMock: jasmine.SpyObj<MatDialog>;

  const userMock: User = {
    _id: '',
    username: '',
    email: '',
    wishlist: [],
  };

  const mockProduct: APIProduct = {
    _id: '123',
    name: '',
    description: '',
    image: '',
    category: [''],
    style: '',
    dimensions: { height: 1, width: 1, depth: 1 },
    material: [''],
    color: '',
    price: 1,
    __v: '1',
    _ownerId: '123',
    createdAt: '2024-03-10T11:27:12.452+00:00',
  };
  const productsSubject = new BehaviorSubject<APIProduct[]>([]);

  beforeEach(async () => {
    authServiceMock = jasmine.createSpyObj('AuthService', [
      'getOwnProducts',
      'clearUserSession',
    ]);
    matDialogMock = jasmine.createSpyObj('MatDialog', ['open']);

    // user$ is an Observable<User|undefined> on the real service
    (authServiceMock as any).user$ = of(userMock);
    authServiceMock.getOwnProducts.and.returnValue(productsSubject.asObservable());

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

    fixture = TestBed.createComponent(ProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should populate the user signal from user$', () => {
    expect(component.user()).toEqual(userMock);
  });

  it('products signal should be empty initially', () => {
    productsSubject.next([]);
    expect(component.products().length).toBe(0);
  });

  it('should populate the products signal when getOwnProducts emits', () => {
    productsSubject.next(new Array(3).fill(mockProduct));
    expect(component.products().length).toBe(3);
    expect(component.products()[0]).toEqual(mockProduct);
  });

  it('should open the edit-profile dialog on edit click', () => {
    component.onEditProfile();
    expect(matDialogMock.open).toHaveBeenCalled();
  });

  it('should clear the session on logout', () => {
    const ngZone = TestBed.inject(NgZone);
    ngZone.run(() => component.handleLogout());
    expect(authServiceMock.clearUserSession).toHaveBeenCalled();
  });

  it('should navigate to home on logout', () => {
    const ngZone = TestBed.inject(NgZone);
    const routerMock = TestBed.inject(Router);
    spyOn(routerMock, 'navigate');

    ngZone.run(() => component.handleLogout());
    expect(routerMock.navigate).toHaveBeenCalledWith(['/']);
  });

  it('should open the delete dialog with the product info', () => {
    component.onDelete(mockProduct);
    expect(matDialogMock.open).toHaveBeenCalled();
  });
});
