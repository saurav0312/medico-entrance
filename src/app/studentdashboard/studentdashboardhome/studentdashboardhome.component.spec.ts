import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StudentdashboardhomeComponent } from './studentdashboardhome.component';

describe('StudentdashboardhomeComponent', () => {
  let component: StudentdashboardhomeComponent;
  let fixture: ComponentFixture<StudentdashboardhomeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StudentdashboardhomeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StudentdashboardhomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
