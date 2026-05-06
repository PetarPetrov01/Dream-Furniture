import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Store } from '@ngrx/store';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

import { RemoveDialogComponent } from './remove-dialog.component';

describe('RemoveDialogComponent', () => {
  let component: RemoveDialogComponent;
  let fixture: ComponentFixture<RemoveDialogComponent>;
  let storeMock: jasmine.SpyObj<Store>;

  beforeEach(async () => {
    storeMock = jasmine.createSpyObj('Store', ['dispatch']);

    await TestBed.configureTestingModule({
      imports: [RemoveDialogComponent],
      providers: [
        {
          provide: Store,
          useValue: storeMock,
        },
        { provide: MAT_DIALOG_DATA, useValue: {} },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(RemoveDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('Should dispatch store onConfirm', () => {
    component.onConfirm();
    expect(storeMock.dispatch).toHaveBeenCalled();
  });
});
