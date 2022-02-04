import { ComponentFixture, TestBed } from '@angular/core/testing';

import { POSManagementComponent } from './pos-management.component';

describe('POSManagementComponent', () => {
  let component: POSManagementComponent;
  let fixture: ComponentFixture<POSManagementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ POSManagementComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(POSManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
