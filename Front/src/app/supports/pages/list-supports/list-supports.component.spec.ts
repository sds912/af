import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListSupportsComponent } from './list-supports.component';

describe('ListSupportsComponent', () => {
  let component: ListSupportsComponent;
  let fixture: ComponentFixture<ListSupportsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListSupportsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListSupportsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
