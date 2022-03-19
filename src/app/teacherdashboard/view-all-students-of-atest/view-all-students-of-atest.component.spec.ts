import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewAllStudentsOfAtestComponent } from './view-all-students-of-atest.component';

describe('ViewAllStudentsOfAtestComponent', () => {
  let component: ViewAllStudentsOfAtestComponent;
  let fixture: ComponentFixture<ViewAllStudentsOfAtestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewAllStudentsOfAtestComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewAllStudentsOfAtestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
