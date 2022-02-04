import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FeaturedProductsFormComponent } from './featured-products-form.component';

describe('FeaturedProductsFormComponent', () => {
  let component: FeaturedProductsFormComponent;
  let fixture: ComponentFixture<FeaturedProductsFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FeaturedProductsFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FeaturedProductsFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
