import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardnavigationbarComponent } from './dashboardnavigationbar.component';

describe('DashboardnavigationbarComponent', () => {
  let component: DashboardnavigationbarComponent;
  let fixture: ComponentFixture<DashboardnavigationbarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DashboardnavigationbarComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DashboardnavigationbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
