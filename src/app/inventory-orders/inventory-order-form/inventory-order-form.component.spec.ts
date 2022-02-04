import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InventoryOrderFormComponent } from './inventory-order-form.component';

describe('InventoryOrderFormComponent', () => {
  let component: InventoryOrderFormComponent;
  let fixture: ComponentFixture<InventoryOrderFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InventoryOrderFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InventoryOrderFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
