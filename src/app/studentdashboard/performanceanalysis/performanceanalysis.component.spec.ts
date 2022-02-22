import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PerformanceanalysisComponent } from './performanceanalysis.component';

describe('PerformanceanalysisComponent', () => {
  let component: PerformanceanalysisComponent;
  let fixture: ComponentFixture<PerformanceanalysisComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PerformanceanalysisComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PerformanceanalysisComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
