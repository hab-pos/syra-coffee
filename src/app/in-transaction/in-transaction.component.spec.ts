import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InTransactionComponent } from './in-transaction.component';

describe('InTransactionComponent', () => {
  let component: InTransactionComponent;
  let fixture: ComponentFixture<InTransactionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InTransactionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InTransactionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
