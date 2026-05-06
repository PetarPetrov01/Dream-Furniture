import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddProductComponent } from './add-product.component';
import { RouterTestingModule } from '@angular/router/testing';
import { ApiService } from '../../shared/api.service';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ProductsComponent } from '../products/products.component';
import { ActivatedRoute, Params } from '@angular/router';
import { BehaviorSubject, EMPTY, of } from 'rxjs';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { PopulatedProduct } from '../../types/Product';
import { User } from '../../types/User';

describe('AddProductComponent', () => {
  let component: AddProductComponent;
  let fixture: ComponentFixture<AddProductComponent>;
  let apiServiceMock: jasmine.SpyObj<ApiService>;
  let activatedRouteMock: jasmine.SpyObj<ActivatedRoute>;
  let fb: jasmine.SpyObj<FormBuilder>;

  const paramsSubject = new BehaviorSubject<Params>({});
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
    dimensions: {
      height: 1,
      width: 1,
      depth: 1,
    },
    material: ['test'],
    color: 'test',
    price: 1,
    __v: '1',
    _ownerId: mockUser,
    createdAt: '2024-03-10T11:27:12.452+00:00',
  };

  beforeEach(async () => {
    apiServiceMock = jasmine.createSpyObj('ApiService', ['getProduct','addProduct','updateProduct']);
    activatedRouteMock = jasmine.createSpyObj('ActivatedRoute', ['params']);
    fb = jasmine.createSpyObj('FormBuilder', ['group']);

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
        { provide: FormBuilder, useValiue: fb },
      ],
    }).compileComponents();

    apiServiceMock.getProduct.and.returnValue(EMPTY);
    activatedRouteMock.params = paramsSubject.asObservable();

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

  it('should not call apiService if params is empty', async () => {
    paramsSubject.next({});

    fixture.detectChanges();
    await fixture.whenStable();

    component.ngOnInit();
    expect(component.isEditing).toBeFalse();
    expect(apiServiceMock.getProduct).not.toHaveBeenCalled();
  });

  it('should get the products if product id is in the params', async () => {
    paramsSubject.next({ id: '123' });

    fixture.detectChanges();

    component.ngOnInit();
    expect(component.isEditing).toBeTrue();
    expect(apiServiceMock.getProduct).toHaveBeenCalledWith('123');
  });

  it('should patch the form when the product is fetched', async () => {
    paramsSubject.next({ id: '123' });
    apiServiceMock.getProduct.and.returnValue(of(mockProduct));

    fixture.detectChanges();

    component.ngOnInit();
    const modifiedProd = { ...mockProduct, ...mockProduct.dimensions };

    //Not all properties are passed to the form!
    Object.entries(component.addProductForm.value).forEach(([k, value]) => {

      // dimensions and price are cast to string in the component!!
      if ((mockProduct.dimensions as any)[k] == true || k == 'price') {
        expect(value).toEqual(String((modifiedProd as any)[k]));
      } else {
        expect(value).toEqual((modifiedProd as any)[k]);
      }
    });
  });

  it('should do nothing on submit if forms is invalid', async ()=>{
    paramsSubject.next({});

    fixture.detectChanges()

    component.handleClick()
    expect(component.addProductForm.valid).toBeFalse();
  })
});
