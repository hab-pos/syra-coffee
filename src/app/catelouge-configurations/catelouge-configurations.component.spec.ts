import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CatelougeConfigurationsComponent } from './catelouge-configurations.component';

describe('CatelougeConfigurationsComponent', () => {
  let component: CatelougeConfigurationsComponent;
  let fixture: ComponentFixture<CatelougeConfigurationsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CatelougeConfigurationsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CatelougeConfigurationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
