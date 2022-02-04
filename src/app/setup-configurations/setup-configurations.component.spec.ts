import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SetupConfigurationsComponent } from './setup-configurations.component';

describe('SetupConfigurationsComponent', () => {
  let component: SetupConfigurationsComponent;
  let fixture: ComponentFixture<SetupConfigurationsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SetupConfigurationsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SetupConfigurationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
