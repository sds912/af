import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NewSupportComponent } from './new-support.component';

describe('NewSupportComponent', () => {
  let component: NewSupportComponent;
  let fixture: ComponentFixture<NewSupportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NewSupportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewSupportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
