import { NgZone } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { BehaviorSubject, EMPTY, of } from 'rxjs';
import { Store } from '@ngrx/store';

import { MatDialog } from '@angular/material/dialog';

import { AuthService } from '../../shared/auth.service';
import { ApiService } from '../../shared/api.service';
import { CartComponent } from './cart.component';

import { User } from '../../types/User';
import { StateProduct } from '../../types/State';

describe('CartComponent', () => {
  let component: CartComponent;
  let fixture: ComponentFixture<CartComponent>;

  let authServiceMock: jasmine.SpyObj<AuthService>;
  let apiServiceMock: jasmine.SpyObj<ApiService>;
  let storeMock: jasmine.SpyObj<Store>;
  let matDiaologMock: jasmine.SpyObj<MatDialog>;

  const productsSubjectMock = new BehaviorSubject<StateProduct[]>([]);

  const mockUser: User = {
    _id: '123',
    email: 'test@mail.com',
    username: 'Test1',
    wishlist: [],
  };

  const mockProduct: StateProduct = {
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
    _ownerId: mockUser,
    quantity: 1,
    createdAt: '2024-03-10T11:27:12.452+00:00',
  };

  const mockCartState: StateProduct[] = [mockProduct];

  beforeEach(async () => {
    authServiceMock = jasmine.createSpyObj(
      'AuthService',
      ['setUserStorage', 'setUserSubject', 'completeOrder'],
      { user: {} }
    );
    apiServiceMock = jasmine.createSpyObj('ApiService', ['toggleWishList']);
    storeMock = jasmine.createSpyObj('Store', ['dispatch', 'select']);
    matDiaologMock = jasmine.createSpyObj('MatDiaolog', ['open']);

    await TestBed.configureTestingModule({
      imports: [
        CartComponent,
        RouterTestingModule.withRoutes([
          { path: 'cart', component: CartComponent },
        ]),
      ],
      providers: [
        { provide: AuthService, useValue: authServiceMock },
        { provide: ApiService, useValue: apiServiceMock },
        { provide: Store, useValue: storeMock },
        { provide: MatDialog, useValue: matDiaologMock },
      ],
    }).compileComponents();

    storeMock.select.and.returnValue(productsSubjectMock.asObservable());

    fixture = TestBed.createComponent(CartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('The cart should be empty', () => {
    productsSubjectMock.next([]);
    expect(component.products?.length).toBeFalsy();
  });

  it('The cart should have products', () => {
    productsSubjectMock.next(mockCartState);
    expect(component.products).toBeTruthy();
    expect(component.products).toEqual(mockCartState);
  });

  it('Should dispatch on quantity increase', () => {
    component.handleIncreaseQuantity(mockProduct);
    expect(storeMock.dispatch).toHaveBeenCalled();
  });

  it('Should dispatch on quantity decrease (quantity > 1)', () => {
    component.handleDecreaseQuantity({ ...mockProduct, quantity: 2 });
    expect(storeMock.dispatch).toHaveBeenCalled();
  });

  it('Should open modal on quantity decrease (when quantity <=1)', () => {
    component.handleDecreaseQuantity(mockProduct);
    expect(matDiaologMock.open).toHaveBeenCalled();
  });

  it('Should dispatch on wish list toggle', () => {
    apiServiceMock.toggleWishList.and.returnValue(EMPTY);

    component.toggleWishlist(mockProduct);

    expect(apiServiceMock.toggleWishList).toHaveBeenCalled();
  });

  it("Should set the product in the user's wishlist", () => {
    const ngZone = TestBed.inject(NgZone);

    apiServiceMock.toggleWishList.and.returnValue(
      of({ ...mockUser, wishlist: ['123'] })
    );
    ngZone.run(() => component.toggleWishlist(mockProduct));

    expect(authServiceMock.setUserStorage).toHaveBeenCalledWith({
      ...mockUser,
      wishlist: ['123'],
    });
    expect(authServiceMock.setUserSubject).toHaveBeenCalledWith({
      ...mockUser,
      wishlist: ['123'],
    });
  });

  it('Should open modal on cart clear', () => {
    component.handleClearCart();
    expect(matDiaologMock.open).toHaveBeenCalled();
  });

  it('Should open modal on product remove', () => {
    component.handleRemove(mockProduct);
    expect(matDiaologMock.open).toHaveBeenCalled();
  });

  it('Should return total count', () => {
    productsSubjectMock.next(new Array(3).fill(mockProduct));
    expect(component.totalCount).toEqual(3);
  });

  it('Should return total price', () => {
    productsSubjectMock.next([
      { ...mockProduct, price: 10 },
      { ...mockProduct, price: 20 },
    ]);
    expect(component.totalPrice).toEqual(30);
  });

  it('Should not complete the order with no products', () => {
    productsSubjectMock.next([]);

    component.handleCompleteOrder();
    expect(authServiceMock.completeOrder).not.toHaveBeenCalled();
  });

  it('Should complete the order', () => {
    productsSubjectMock.next(mockCartState);

    authServiceMock.completeOrder.and.returnValue(EMPTY);
    component.handleCompleteOrder();
    expect(authServiceMock.completeOrder).toHaveBeenCalled();
  });
});
