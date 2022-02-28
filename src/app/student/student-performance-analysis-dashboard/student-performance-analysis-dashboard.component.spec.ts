import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StudentPerformanceAnalysisDashboardComponent } from './student-performance-analysis-dashboard.component';

describe('StudentPerformanceAnalysisDashboardComponent', () => {
  let component: StudentPerformanceAnalysisDashboardComponent;
  let fixture: ComponentFixture<StudentPerformanceAnalysisDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StudentPerformanceAnalysisDashboardComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StudentPerformanceAnalysisDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
