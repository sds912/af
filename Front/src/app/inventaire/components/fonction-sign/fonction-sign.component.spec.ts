import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FonctionSignComponent } from './fonction-sign.component';

describe('FonctionSignComponent', () => {
  let component: FonctionSignComponent;
  let fixture: ComponentFixture<FonctionSignComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FonctionSignComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FonctionSignComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
