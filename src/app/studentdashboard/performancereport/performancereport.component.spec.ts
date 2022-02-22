import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PerformancereportComponent } from './performancereport.component';

describe('PerformancereportComponent', () => {
  let component: PerformancereportComponent;
  let fixture: ComponentFixture<PerformancereportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PerformancereportComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PerformancereportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
