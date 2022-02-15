import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TestsAnalysisDashboardComponent } from './tests-analysis-dashboard.component';

describe('TestsAnalysisDashboardComponent', () => {
  let component: TestsAnalysisDashboardComponent;
  let fixture: ComponentFixture<TestsAnalysisDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TestsAnalysisDashboardComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TestsAnalysisDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
