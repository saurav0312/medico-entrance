import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TeacherprofileinfoComponent } from './teacherprofileinfo.component';

describe('TeacherprofileinfoComponent', () => {
  let component: TeacherprofileinfoComponent;
  let fixture: ComponentFixture<TeacherprofileinfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TeacherprofileinfoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TeacherprofileinfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
