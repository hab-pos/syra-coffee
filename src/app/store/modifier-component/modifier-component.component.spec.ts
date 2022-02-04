import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModifierComponentComponent } from './modifier-component.component';

describe('ModifierComponentComponent', () => {
  let component: ModifierComponentComponent;
  let fixture: ComponentFixture<ModifierComponentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModifierComponentComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ModifierComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
