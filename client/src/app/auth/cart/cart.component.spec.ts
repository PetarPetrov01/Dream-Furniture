import { NgZone, signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { EMPTY, of } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';

import { AuthService } from '../../shared/auth.service';
import { ApiService } from '../../shared/api.service';
import { CartComponent } from './cart.component';
import { CartStore } from './cart.store';

import { User } from '../../types/User';
import { StateProduct } from '../../types/State';

describe('CartComponent', () => {
  let component: CartComponent;
  let fixture: ComponentFixture<CartComponent>;

  let authServiceMock: jasmine.SpyObj<AuthService>;
  let apiServiceMock: jasmine.SpyObj<ApiService>;
  let cartStoreMock: jasmine.SpyObj<CartStore>;
  let matDialogMock: jasmine.SpyObj<MatDialog>;

  // Writable signals so individual tests can drive the store state.
  const itemsSig = signal<StateProduct[]>([]);
  const totalCountSig = signal(0);
  const totalPriceSig = signal(0);

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
    dimensions: { height: 1, width: 1, depth: 1 },
    material: [''],
    color: '',
    price: 1,
    __v: '1',
    _ownerId: mockUser,
    quantity: 1,
    createdAt: '2024-03-10T11:27:12.452+00:00',
  };

  beforeEach(async () => {
    authServiceMock = jasmine.createSpyObj(
      'AuthService',
      ['setUserStorage', 'setUserSubject', 'completeOrder'],
      { user: {} }
    );
    apiServiceMock = jasmine.createSpyObj('ApiService', ['toggleWishList']);
    cartStoreMock = jasmine.createSpyObj(
      'CartStore',
      ['addItem', 'decrease', 'remove', 'reset'],
      {
        items: itemsSig,
        totalCount: totalCountSig,
        totalPrice: totalPriceSig,
      }
    );
    matDialogMock = jasmine.createSpyObj('MatDialog', ['open']);

    // Reset signal state per test.
    itemsSig.set([]);
    totalCountSig.set(0);
    totalPriceSig.set(0);

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
        { provide: CartStore, useValue: cartStoreMock },
        { provide: MatDialog, useValue: matDialogMock },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(CartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('the cart should be empty initially', () => {
    expect(component.products()).toEqual([]);
    expect(component.totalCount()).toBe(0);
  });

  it('the cart should expose products from the store', () => {
    itemsSig.set([mockProduct]);
    expect(component.products()).toEqual([mockProduct]);
  });

  it('should call addItem on quantity increase', () => {
    component.handleIncreaseQuantity(mockProduct);
    expect(cartStoreMock.addItem).toHaveBeenCalledWith(mockProduct, 1);
  });

  it('should call decrease on quantity decrease (quantity > 1)', () => {
    component.handleDecreaseQuantity({ ...mockProduct, quantity: 2 });
    expect(cartStoreMock.decrease).toHaveBeenCalledWith(mockProduct._id);
  });

  it('should open modal on quantity decrease (when quantity <= 1)', () => {
    component.handleDecreaseQuantity(mockProduct);
    expect(matDialogMock.open).toHaveBeenCalled();
  });

  it('should call toggleWishList on wishlist toggle', () => {
    apiServiceMock.toggleWishList.and.returnValue(EMPTY);
    component.toggleWishlist(mockProduct);
    expect(apiServiceMock.toggleWishList).toHaveBeenCalled();
  });

  it("should sync the user when the wishlist toggle returns", () => {
    const ngZone = TestBed.inject(NgZone);
    const updatedUser = { ...mockUser, wishlist: ['123'] };
    apiServiceMock.toggleWishList.and.returnValue(of(updatedUser));

    ngZone.run(() => component.toggleWishlist(mockProduct));

    expect(authServiceMock.setUserStorage).toHaveBeenCalledWith(updatedUser);
    expect(authServiceMock.setUserSubject).toHaveBeenCalledWith(updatedUser);
  });

  it('should open modal on cart clear', () => {
    component.handleClearCart();
    expect(matDialogMock.open).toHaveBeenCalled();
  });

  it('should open modal on product remove', () => {
    component.handleRemove(mockProduct);
    expect(matDialogMock.open).toHaveBeenCalled();
  });

  it('should expose totalCount and totalPrice from the store', () => {
    totalCountSig.set(3);
    totalPriceSig.set(30);
    expect(component.totalCount()).toBe(3);
    expect(component.totalPrice()).toBe(30);
  });

  it('should not complete the order when the cart is empty', () => {
    itemsSig.set([]);
    component.handleCompleteOrder();
    expect(authServiceMock.completeOrder).not.toHaveBeenCalled();
  });

  it('should complete the order when the cart has items', () => {
    itemsSig.set([mockProduct]);
    authServiceMock.completeOrder.and.returnValue(EMPTY);
    component.handleCompleteOrder();
    expect(authServiceMock.completeOrder).toHaveBeenCalled();
  });
});
