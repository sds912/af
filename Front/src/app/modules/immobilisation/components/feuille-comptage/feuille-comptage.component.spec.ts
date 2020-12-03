import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FeuilleComptageComponent } from './feuille-comptage.component';

describe('FeuilleComptageComponent', () => {
  let component: FeuilleComptageComponent;
  let fixture: ComponentFixture<FeuilleComptageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FeuilleComptageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FeuilleComptageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
