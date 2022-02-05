import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StudentdashboardcontentComponent } from './studentdashboardcontent.component';

describe('StudentdashboardcontentComponent', () => {
  let component: StudentdashboardcontentComponent;
  let fixture: ComponentFixture<StudentdashboardcontentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StudentdashboardcontentComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StudentdashboardcontentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
