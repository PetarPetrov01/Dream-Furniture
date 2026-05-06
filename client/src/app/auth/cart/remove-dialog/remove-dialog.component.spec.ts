import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

import { RemoveDialogComponent } from './remove-dialog.component';
import { CartStore } from '../cart.store';

describe('RemoveDialogComponent', () => {
  let component: RemoveDialogComponent;
  let fixture: ComponentFixture<RemoveDialogComponent>;
  let cartStoreMock: jasmine.SpyObj<CartStore>;

  const dialogData = { productName: 'Sample', _id: 'abc-123' };

  beforeEach(async () => {
    cartStoreMock = jasmine.createSpyObj('CartStore', ['remove']);

    await TestBed.configureTestingModule({
      imports: [RemoveDialogComponent],
      providers: [
        { provide: CartStore, useValue: cartStoreMock },
        { provide: MAT_DIALOG_DATA, useValue: dialogData },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(RemoveDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should remove the product by id on confirm', () => {
    component.onConfirm();
    expect(cartStoreMock.remove).toHaveBeenCalledWith(dialogData._id);
  });
});
