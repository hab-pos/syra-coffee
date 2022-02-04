import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddInventoryOrderComponent } from './add-inventory-order.component';

describe('AddInventoryOrderComponent', () => {
  let component: AddInventoryOrderComponent;
  let fixture: ComponentFixture<AddInventoryOrderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddInventoryOrderComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddInventoryOrderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
