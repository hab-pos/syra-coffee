import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InventoryOrdersComponent } from './inventory-orders.component';

describe('InventoryOrdersComponent', () => {
  let component: InventoryOrdersComponent;
  let fixture: ComponentFixture<InventoryOrdersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InventoryOrdersComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InventoryOrdersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
