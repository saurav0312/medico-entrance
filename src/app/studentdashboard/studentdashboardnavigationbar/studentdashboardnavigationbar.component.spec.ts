import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StudentdashboardnavigationbarComponent } from './studentdashboardnavigationbar.component';

describe('StudentdashboardnavigationbarComponent', () => {
  let component: StudentdashboardnavigationbarComponent;
  let fixture: ComponentFixture<StudentdashboardnavigationbarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StudentdashboardnavigationbarComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StudentdashboardnavigationbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
