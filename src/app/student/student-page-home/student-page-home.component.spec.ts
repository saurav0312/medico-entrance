import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StudentPageHomeComponent } from './student-page-home.component';

describe('StudentPageHomeComponent', () => {
  let component: StudentPageHomeComponent;
  let fixture: ComponentFixture<StudentPageHomeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StudentPageHomeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StudentPageHomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
