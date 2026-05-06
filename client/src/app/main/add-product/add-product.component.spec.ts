import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, Params } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';

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
  let fb: jasmine.SpyObj<FormBuilder>;

  let paramsSubject: BehaviorSubject<Params>;

  const mockUser: User = {
    _id: '123',
    email: 'testemail@gmail.com',
    username: 'testUser',
    wishlist: [''],
  };

  const mockProduct: PopulatedProduct = {
    _id: '123',
    name: 'testProduct',
    description: 'test',
    image: 'test/img',
    category: ['test'],
    style: 'test',
    dimensions: { height: 1, width: 1, depth: 1 },
    material: ['test'],
    color: 'test',
    price: 1,
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
    fb = jasmine.createSpyObj('FormBuilder', ['group']);

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
        { provide: FormBuilder, useValue: fb },
      ],
    }).compileComponents();

    apiServiceMock.getProduct.and.returnValue(EMPTY);

    fb.group.and.returnValue(
      new FormGroup({
        name: new FormControl('', Validators.required),
        description: new FormControl('', Validators.required),
        image: new FormControl('', Validators.required),
        category: new FormControl([''], Validators.required),
        style: new FormControl('', Validators.required),
        height: new FormControl('', Validators.required),
        width: new FormControl('', Validators.required),
        depth: new FormControl('', Validators.required),
        material: new FormControl([''], Validators.required),
        color: new FormControl('', Validators.required),
        price: new FormControl('', Validators.required),
      })
    );

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

  it('should fetch the product when an id is in the params', () => {
    paramsSubject.next({ id: '123' });
    expect(component.isEditing()).toBeTrue();
    expect(apiServiceMock.getProduct).toHaveBeenCalledWith('123');
  });

  it('should patch the form when the product is fetched', () => {
    apiServiceMock.getProduct.and.returnValue(of(mockProduct));
    paramsSubject.next({ id: '123' });

    const modifiedProd = { ...mockProduct, ...mockProduct.dimensions };

    Object.entries(component.addProductForm.value).forEach(([k, value]) => {
      // dimensions and price are cast to string in the component;
      // (mockProduct.dimensions as any)[k] is a numeric truthy value
      // for the dimension keys (height, width, depth), which is why
      // `== true` works to identify them.
      // eslint-disable-next-line eqeqeq
      if ((mockProduct.dimensions as any)[k] == true || k === 'price') {
        expect(value).toEqual(String((modifiedProd as any)[k]));
      } else {
        expect(value).toEqual((modifiedProd as any)[k]);
      }
    });
  });

  it('should do nothing on submit if the form is invalid', () => {
    component.handleClick();
    expect(component.addProductForm.valid).toBeFalse();
    expect(apiServiceMock.addProduct).not.toHaveBeenCalled();
    expect(apiServiceMock.updateProduct).not.toHaveBeenCalled();
  });
});
