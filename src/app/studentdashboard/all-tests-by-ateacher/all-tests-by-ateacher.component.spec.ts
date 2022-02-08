import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AllTestsByATeacherComponent } from './all-tests-by-ateacher.component';

describe('AllTestsByATeacherComponent', () => {
  let component: AllTestsByATeacherComponent;
  let fixture: ComponentFixture<AllTestsByATeacherComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AllTestsByATeacherComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AllTestsByATeacherComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
