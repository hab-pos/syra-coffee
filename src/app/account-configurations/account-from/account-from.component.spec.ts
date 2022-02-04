import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AccountFromComponent } from './account-from.component';

describe('AccountFromComponent', () => {
  let component: AccountFromComponent;
  let fixture: ComponentFixture<AccountFromComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AccountFromComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AccountFromComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
