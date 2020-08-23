import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ImmobilisationComponent } from './immobilisation.component';

describe('ImmobilisationComponent', () => {
  let component: ImmobilisationComponent;
  let fixture: ComponentFixture<ImmobilisationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ImmobilisationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ImmobilisationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
