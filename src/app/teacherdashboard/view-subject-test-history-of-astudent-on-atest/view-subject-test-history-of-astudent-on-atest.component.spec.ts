import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewSubjectTestHistoryOfAStudentOnATestComponent } from './view-subject-test-history-of-astudent-on-atest.component';

describe('ViewSubjectTestHistoryOfAStudentOnATestComponent', () => {
  let component: ViewSubjectTestHistoryOfAStudentOnATestComponent;
  let fixture: ComponentFixture<ViewSubjectTestHistoryOfAStudentOnATestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewSubjectTestHistoryOfAStudentOnATestComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewSubjectTestHistoryOfAStudentOnATestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
