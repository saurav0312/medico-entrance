import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailSubjectTestReportComponent } from './detail-subject-test-report.component';

describe('DetailSubjectTestReportComponent', () => {
  let component: DetailSubjectTestReportComponent;
  let fixture: ComponentFixture<DetailSubjectTestReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DetailSubjectTestReportComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DetailSubjectTestReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
