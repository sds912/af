import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AffectationNewModelComponent } from './affectation-new-model.component';

describe('AffectationNewModelComponent', () => {
  let component: AffectationNewModelComponent;
  let fixture: ComponentFixture<AffectationNewModelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AffectationNewModelComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AffectationNewModelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
