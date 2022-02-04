import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AccountConfigurationsComponent } from './account-configurations.component';

describe('AccountConfigurationsComponent', () => {
  let component: AccountConfigurationsComponent;
  let fixture: ComponentFixture<AccountConfigurationsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AccountConfigurationsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AccountConfigurationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
