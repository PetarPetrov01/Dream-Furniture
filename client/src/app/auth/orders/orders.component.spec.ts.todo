import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';

import { OrdersComponent } from './orders.component';
import { AuthService } from '../../shared/auth.service';
import { RouterTestingModule } from '@angular/router/testing';
import { EMPTY, of } from 'rxjs';
import { APIOrder } from '../../types/Order';
import { APIProduct } from '../../types/Product';

describe('OrdersComponent', () => {
  let component: OrdersComponent;
  let fixture: ComponentFixture<OrdersComponent>;
  let authServiceMock: jasmine.SpyObj<AuthService>;
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
    _ownerId: '111',
    createdAt: '123',
  };

  const mockOrder: APIOrder = {
    _id: '123',
    products: [{ _id: '123', product: mockProduct, count: 1 }],
    totalPrice: 10,
    createdAt: '123',
  };

  beforeEach(async () => {
    authServiceMock = jasmine.createSpyObj('AuthService', [
      'getOrders',
      'deleteOrder',
    ]);

    await TestBed.configureTestingModule({
      imports: [OrdersComponent, RouterTestingModule],
      providers: [
        {
          provide: AuthService,
          useValue: authServiceMock,
        },
      ],
    }).compileComponents();
    authServiceMock.getOrders.and.returnValue(EMPTY);
    authServiceMock.deleteOrder.and.returnValue(of([]));

    fixture = TestBed.createComponent(OrdersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('Should call getOrders on init', () => {
    component.ngOnInit();
    expect(authServiceMock.getOrders).toHaveBeenCalled();
  });

  it('Should set the orders', () => {
    authServiceMock.getOrders.and.returnValue(of([mockOrder]))

    component.ngOnInit();
    expect(component.orders).toEqual([mockOrder]);
  });

  it('Should call deleteOrder', () => {
    component.handleDelete('123');

    expect(authServiceMock.deleteOrder).toHaveBeenCalledWith('123');
    expect(authServiceMock.getOrders).toHaveBeenCalled();
  });

  it('Should delete the order', fakeAsync(async()=>{
    authServiceMock.getOrders.and.returnValue(of([]))
    component.orders = [mockOrder];

    component.handleDelete('123')
    tick(2000);
    await fixture.whenStable();
    expect(component.orders.length).toBeFalsy();
  }))

});
