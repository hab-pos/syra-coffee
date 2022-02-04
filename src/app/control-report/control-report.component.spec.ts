import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ControlReportComponent } from './control-report.component';

describe('ControlReportComponent', () => {
  let component: ControlReportComponent;
  let fixture: ComponentFixture<ControlReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ControlReportComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ControlReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
