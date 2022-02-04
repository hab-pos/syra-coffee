import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddproductComponentComponent } from './addproduct-component.component';

describe('AddproductComponentComponent', () => {
  let component: AddproductComponentComponent;
  let fixture: ComponentFixture<AddproductComponentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddproductComponentComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddproductComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
