import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminDashboardHomeContentComponent } from './admin-dashboard-home-content.component';

describe('AdminDashboardHomeContentComponent', () => {
  let component: AdminDashboardHomeContentComponent;
  let fixture: ComponentFixture<AdminDashboardHomeContentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdminDashboardHomeContentComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminDashboardHomeContentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
