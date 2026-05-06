import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductDetailsComponent } from './product-details.component';
import {} from '@angular/common/http';
import { ApiService } from '../../shared/api.service';
import { RouterTestingModule } from '@angular/router/testing';
import { AuthService } from '../../shared/auth.service';
import { Store } from '@ngrx/store';
import { APIProduct, PopulatedProduct } from '../../types/Product';
import { EMPTY, of } from 'rxjs';
import { User } from '../../types/User';

describe('ProductDetailsComponent', () => {
  let component: ProductDetailsComponent;
  let fixture: ComponentFixture<ProductDetailsComponent>;
  let apiServiceMock: jasmine.SpyObj<ApiService>;
  let authServiceMock: jasmine.SpyObj<AuthService>;
  let storeMock: jasmine.SpyObj<Store>;

  const mockPopulatedProduct: PopulatedProduct = {
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
    _ownerId: {
      _id: '123',
      email: 'test@mail.com',
      username: 'Test1',
      wishlist: [],
    },
    createdAt: '2024-03-10T11:27:12.452+00:00',
  };

  const mockUser: User = {
    _id: '123',
    email: 'test@mail.com',
    username: 'Test1',
    wishlist: [],
  };

  beforeEach(async () => {
    apiServiceMock = jasmine.createSpyObj('ApiService', ['getProduct']);
    authServiceMock = jasmine.createSpyObj('AuthService', [
      'isLogged',
      'setUserStorage',
      'setUserSubject',
    ]);
    storeMock = jasmine.createSpyObj('Store', ['']);

    await TestBed.configureTestingModule({
      imports: [ProductDetailsComponent, RouterTestingModule],
      providers: [
        { provide: ApiService, useValue: apiServiceMock },
        { provide: AuthService, useValue: authServiceMock },
        { provide: Store, useValue: storeMock },
      ],
    }).compileComponents();

    apiServiceMock.getProduct.and.returnValue(EMPTY);

    fixture = TestBed.createComponent(ProductDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('product should be null', () => {
    expect(component.product).toBeFalsy();
  });

  it('should set the product', () => {
    apiServiceMock.getProduct.and.returnValue(of(mockPopulatedProduct));
    component.ngOnInit();
    expect(component.product).toEqual(mockPopulatedProduct);
  });

  it('should return false if the user is not logged in', () => {
    expect(component.isUser).toBeTruthy();
  });
  
  it('should return true if the user is authorized', () => {
    apiServiceMock.getProduct.and.returnValue(of(mockPopulatedProduct));
    
    authServiceMock.setUserStorage(mockUser);
    authServiceMock.setUserSubject(mockUser);
    expect(component.isUser).toBeTruthy();
  });

  it('should return true for the owner of the product', (done) => {
    apiServiceMock.getProduct.and.returnValue(of(mockPopulatedProduct));

    authServiceMock.setUserStorage({ ...mockUser, _id: '123' });
    authServiceMock.setUserSubject({ ...mockUser, _id: '123' });

    expect(component.isOwner).toBeTruthy();
    done();
  });
});
