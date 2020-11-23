import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CodeDefectueuxComponent } from './code-defectueux.component';

describe('CodeDefectueuxComponent', () => {
  let component: CodeDefectueuxComponent;
  let fixture: ComponentFixture<CodeDefectueuxComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CodeDefectueuxComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CodeDefectueuxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
