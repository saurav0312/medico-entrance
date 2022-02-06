import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TeacherdashboardhomeComponent } from './teacherdashboardhome.component';

describe('TeacherdashboardhomeComponent', () => {
  let component: TeacherdashboardhomeComponent;
  let fixture: ComponentFixture<TeacherdashboardhomeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TeacherdashboardhomeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TeacherdashboardhomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
