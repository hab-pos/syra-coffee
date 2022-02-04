import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CatelougeFormComponent } from './catelouge-form.component';

describe('CatelougeFormComponent', () => {
  let component: CatelougeFormComponent;
  let fixture: ComponentFixture<CatelougeFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CatelougeFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CatelougeFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
