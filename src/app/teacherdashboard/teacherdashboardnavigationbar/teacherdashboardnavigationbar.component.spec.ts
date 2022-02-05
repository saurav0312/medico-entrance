import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TeacherdashboardnavigationbarComponent } from './teacherdashboardnavigationbar.component';

describe('TeacherdashboardnavigationbarComponent', () => {
  let component: TeacherdashboardnavigationbarComponent;
  let fixture: ComponentFixture<TeacherdashboardnavigationbarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TeacherdashboardnavigationbarComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TeacherdashboardnavigationbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
