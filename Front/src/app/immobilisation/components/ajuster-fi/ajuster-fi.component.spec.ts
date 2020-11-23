import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AjusterFiComponent } from './ajuster-fi.component';

describe('AjusterFiComponent', () => {
  let component: AjusterFiComponent;
  let fixture: ComponentFixture<AjusterFiComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AjusterFiComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AjusterFiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
