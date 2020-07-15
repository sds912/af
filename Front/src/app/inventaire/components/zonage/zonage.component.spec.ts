import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ZonageComponent } from './zonage.component';

describe('ZonageComponent', () => {
  let component: ZonageComponent;
  let fixture: ComponentFixture<ZonageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ZonageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ZonageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
