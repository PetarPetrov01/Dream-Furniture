import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { EMPTY, of } from 'rxjs';

import { WishlistComponent } from './wishlist.component';
import { ApiService } from '../../shared/api.service';
import { AuthService } from '../../shared/auth.service';
import { CartStore } from '../cart/cart.store';
import { FloorPricePipe } from '../../shared/pipes/floor-price.pipe';
import { DecimalSlicePipe } from '../../shared/pipes/decimal-slice.pipe';

import { PopulatedProduct } from '../../types/Product';
import { User } from '../../types/User';

describe('WishlistComponent', () => {
  let component: WishlistComponent;
  let fixture: ComponentFixture<WishlistComponent>;

  let authServiceMock: jasmine.SpyObj<AuthService>;
  let apiServiceMock: jasmine.SpyObj<ApiService>;
  let cartStoreMock: jasmine.SpyObj<CartStore>;

  const mockUser: User = {
    _id: '123',
    email: 'test@mail.com',
    username: 'Test1',
    wishlist: [],
  };

  const mockProduct: PopulatedProduct = {
    _id: '123',
    slug: 'mock-product',
    name: '',
    description: '',
    shortDescription: '',
    images: [''],
    category: [''],
    style: '',
    dimensions: { height: 1, width: 1, depth: 1 },
    material: [''],
    color: '',
    price: 1,
    isFeatured: false,
    inStock: true,
    tags: [],
    __v: '1',
    _ownerId: mockUser,
    createdAt: '2024-03-10T11:27:12.452+00:00',
  };

  beforeEach(async () => {
    authServiceMock = jasmine.createSpyObj('AuthService', [
      'getWishlist',
      'setUserStorage',
      'setUserSubject',
    ]);
    apiServiceMock = jasmine.createSpyObj('ApiService', ['toggleWishList']);
    cartStoreMock = jasmine.createSpyObj('CartStore', ['addItem']);

    authServiceMock.getWishlist.and.returnValue(EMPTY);

    await TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        FloorPricePipe,
        DecimalSlicePipe,
        WishlistComponent,
      ],
      providers: [
        { provide: AuthService, useValue: authServiceMock },
        { provide: ApiService, useValue: apiServiceMock },
        { provide: CartStore, useValue: cartStoreMock },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(WishlistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should fetch the wishlist on init', () => {
    expect(authServiceMock.getWishlist).toHaveBeenCalled();
  });

  it('the wishlist should be empty initially', () => {
    expect(component.wishlist()).toEqual([]);
  });

  it('should set the wishlist when the service emits', () => {
    authServiceMock.getWishlist.and.returnValue(
      of(new Array(3).fill(mockProduct))
    );
    component.fetchWishList();
    expect(component.wishlist().length).toBe(3);
    expect(component.wishlist()[0]).toEqual(mockProduct);
  });

  it('removing should sync the returned user', () => {
    const updatedUser = { ...mockUser, wishlist: [] };
    apiServiceMock.toggleWishList.and.returnValue(of(updatedUser));
    authServiceMock.getWishlist.and.returnValue(of([]));

    component.onRemove('123');

    expect(apiServiceMock.toggleWishList).toHaveBeenCalledWith('123');
    expect(authServiceMock.setUserStorage).toHaveBeenCalledWith(updatedUser);
    expect(authServiceMock.setUserSubject).toHaveBeenCalledWith(updatedUser);
  });

  it('add to cart should call CartStore.addItem with qty=1', () => {
    component.onAddToCart(mockProduct);
    expect(cartStoreMock.addItem).toHaveBeenCalledWith(mockProduct, 1);
  });
});
