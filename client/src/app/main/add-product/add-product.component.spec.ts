import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, Params } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { BehaviorSubject, EMPTY, of } from 'rxjs';

import { AddProductComponent } from './add-product.component';
import { ProductsComponent } from '../products/products.component';
import { ApiService } from '../../shared/api.service';

import { PopulatedProduct } from '../../types/Product';
import { User } from '../../types/User';

describe('AddProductComponent', () => {
  let component: AddProductComponent;
  let fixture: ComponentFixture<AddProductComponent>;
  let apiServiceMock: jasmine.SpyObj<ApiService>;
  let activatedRouteMock: any;

  let paramsSubject: BehaviorSubject<Params>;

  const mockUser: User = {
    _id: '123',
    email: 'testemail@gmail.com',
    username: 'testUser',
    wishlist: [''],
  };

  const mockProduct: PopulatedProduct = {
    _id: '123',
    slug: 'test-product',
    name: 'testProduct',
    description: 'test',
    shortDescription: 'short',
    images: ['test/img'],
    category: ['test'],
    style: 'test',
    dimensions: { height: 1, width: 1, depth: 1 },
    material: ['test'],
    color: 'test',
    price: 1,
    isFeatured: false,
    inStock: true,
    tags: [],
    __v: '1',
    _ownerId: mockUser,
    createdAt: '2024-03-10T11:27:12.452+00:00',
  };

  beforeEach(async () => {
    // Fresh subject each test so describe-scoped state can't leak.
    paramsSubject = new BehaviorSubject<Params>({});

    apiServiceMock = jasmine.createSpyObj('ApiService', [
      'getProduct',
      'addProduct',
      'updateProduct',
    ]);

    activatedRouteMock = { params: paramsSubject.asObservable() };

    await TestBed.configureTestingModule({
      imports: [
        AddProductComponent,
        RouterTestingModule.withRoutes([
          { path: 'products', component: ProductsComponent },
        ]),
        BrowserAnimationsModule,
      ],
      providers: [
        { provide: ApiService, useValue: apiServiceMock },
        { provide: ActivatedRoute, useValue: activatedRouteMock },
      ],
    }).compileComponents();

    apiServiceMock.getProduct.and.returnValue(EMPTY);

    fixture = TestBed.createComponent(AddProductComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should not call apiService when params are empty', () => {
    expect(component.isEditing()).toBeFalse();
    expect(apiServiceMock.getProduct).not.toHaveBeenCalled();
  });

  it('should fetch the product when a slug is in the params', () => {
    paramsSubject.next({ slug: 'test-product' });
    expect(component.isEditing()).toBeTrue();
    expect(apiServiceMock.getProduct).toHaveBeenCalledWith('test-product');
  });

  it('should patch the form when the product is fetched', () => {
    apiServiceMock.getProduct.and.returnValue(of(mockProduct));
    paramsSubject.next({ slug: 'test-product' });

    const value = component.addProductForm.value;
    expect(value.name).toBe(mockProduct.name);
    expect(value.description).toBe(mockProduct.description);
    expect(value.shortDescription).toBe(mockProduct.shortDescription);
    expect(value.color).toBe(mockProduct.color);
    expect(value.style).toBe(mockProduct.style);
    expect(value.category).toEqual(mockProduct.category);
    expect(value.material).toEqual(mockProduct.material);
    expect(value.height).toBe(String(mockProduct.dimensions.height));
    expect(value.width).toBe(String(mockProduct.dimensions.width));
    expect(value.depth).toBe(String(mockProduct.dimensions.depth));
    expect(value.price).toBe(String(mockProduct.price));
    expect(value.inStock).toBe(mockProduct.inStock);
    expect(component.images.value).toEqual(mockProduct.images);
  });

  it('should do nothing on submit if the form is invalid', () => {
    component.handleClick();
    expect(component.addProductForm.valid).toBeFalse();
    expect(apiServiceMock.addProduct).not.toHaveBeenCalled();
    expect(apiServiceMock.updateProduct).not.toHaveBeenCalled();
  });
});
