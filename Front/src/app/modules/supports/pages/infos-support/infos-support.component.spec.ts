import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InfosSupportComponent } from './infos-support.component';

describe('InfosSupportComponent', () => {
  let component: InfosSupportComponent;
  let fixture: ComponentFixture<InfosSupportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InfosSupportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InfosSupportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
