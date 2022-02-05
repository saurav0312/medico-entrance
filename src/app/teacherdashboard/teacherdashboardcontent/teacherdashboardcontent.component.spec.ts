import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TeacherdashboardcontentComponent } from './teacherdashboardcontent.component';

describe('TeacherdashboardcontentComponent', () => {
  let component: TeacherdashboardcontentComponent;
  let fixture: ComponentFixture<TeacherdashboardcontentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TeacherdashboardcontentComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TeacherdashboardcontentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
