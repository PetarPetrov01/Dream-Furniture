import { signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { MatDialog } from '@angular/material/dialog';

import { EMPTY, of } from 'rxjs';

import { ProductDetailsComponent } from './product-details.component';
import { ApiService } from '../../shared/api.service';
import { AuthService } from '../../shared/auth.service';
import { CartStore } from '../../auth/cart/cart.store';
import { NotificationService } from '../../shared/notification/notification.service';
import { PopulatedProduct } from '../../types/Product';
import { User } from '../../types/User';

describe('ProductDetailsComponent', () => {
  let component: ProductDetailsComponent;
  let fixture: ComponentFixture<ProductDetailsComponent>;
  let apiServiceMock: jasmine.SpyObj<ApiService>;
  let authServiceMock: jasmine.SpyObj<AuthService>;
  let cartStoreMock: jasmine.SpyObj<CartStore>;
  let notificationServiceMock: jasmine.SpyObj<NotificationService>;
  let matDialogMock: jasmine.SpyObj<MatDialog>;

  const mockOwner: User = {
    _id: '123',
    email: 'test@mail.com',
    username: 'Test1',
    wishlist: [],
  };

  const mockPopulatedProduct: PopulatedProduct = {
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
    _ownerId: mockOwner,
    createdAt: '2024-03-10T11:27:12.452+00:00',
  };

  beforeEach(async () => {
    apiServiceMock = jasmine.createSpyObj('ApiService', ['getProduct', 'toggleWishList']);
    authServiceMock = jasmine.createSpyObj(
      'AuthService',
      ['setUserStorage', 'setUserSubject'],
      { isLogged: false, user: undefined }
    );
    cartStoreMock = jasmine.createSpyObj(
      'CartStore',
      ['addItem'],
      {
        items: signal([]),
        totalCount: signal(0),
        totalPrice: signal(0),
      }
    );
    notificationServiceMock = jasmine.createSpyObj('NotificationService', ['setNotification']);
    matDialogMock = jasmine.createSpyObj('MatDialog', ['open']);

    apiServiceMock.getProduct.and.returnValue(EMPTY);

    await TestBed.configureTestingModule({
      imports: [ProductDetailsComponent, RouterTestingModule],
      providers: [
        { provide: ApiService, useValue: apiServiceMock },
        { provide: AuthService, useValue: authServiceMock },
        { provide: CartStore, useValue: cartStoreMock },
        { provide: NotificationService, useValue: notificationServiceMock },
        { provide: MatDialog, useValue: matDialogMock },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ProductDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('product should be null initially', () => {
    expect(component.product()).toBeNull();
  });

  it('should set the product when the api emits', () => {
    apiServiceMock.getProduct.and.returnValue(of(mockPopulatedProduct));
    component.ngOnInit();
    expect(component.product()).toEqual(mockPopulatedProduct);
  });

  it('isUser reflects authService.isLogged', () => {
    expect(component.isUser).toBeFalse();
  });

  it('isOwner is true when product owner _id matches the user _id', () => {
    apiServiceMock.getProduct.and.returnValue(of(mockPopulatedProduct));
    component.ngOnInit();
    Object.defineProperty(authServiceMock, 'user', { get: () => ({ _id: '123' }) });
    expect(component.isOwner).toBeTrue();
  });

  it('addToCart should call CartStore.addItem and notify', () => {
    apiServiceMock.getProduct.and.returnValue(of(mockPopulatedProduct));
    component.ngOnInit();

    component.buyQty = 2;
    component.addToCart();

    expect(cartStoreMock.addItem).toHaveBeenCalledWith(mockPopulatedProduct, 2);
    expect(notificationServiceMock.setNotification).toHaveBeenCalled();
  });

  it('addToCart should be a no-op when no product is loaded', () => {
    component.addToCart();
    expect(cartStoreMock.addItem).not.toHaveBeenCalled();
  });

  it('addQty caps at CART_MAX_QTY (50)', () => {
    component.buyQty = 50;
    component.addQty();
    expect(component.buyQty).toBe(50);
  });

  it('removeQty does not go below 1', () => {
    component.buyQty = 1;
    component.removeQty();
    expect(component.buyQty).toBe(1);
  });
});
