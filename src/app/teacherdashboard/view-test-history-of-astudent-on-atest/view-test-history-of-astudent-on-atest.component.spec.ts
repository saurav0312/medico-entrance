import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewTestHistoryOfAStudentOnATestComponent } from './view-test-history-of-astudent-on-atest.component';

describe('ViewTestHistoryOfAStudentOnATestComponent', () => {
  let component: ViewTestHistoryOfAStudentOnATestComponent;
  let fixture: ComponentFixture<ViewTestHistoryOfAStudentOnATestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewTestHistoryOfAStudentOnATestComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewTestHistoryOfAStudentOnATestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
