import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OutTransactionComponent } from './out-transaction.component';

describe('OutTransactionComponent', () => {
  let component: OutTransactionComponent;
  let fixture: ComponentFixture<OutTransactionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OutTransactionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OutTransactionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
