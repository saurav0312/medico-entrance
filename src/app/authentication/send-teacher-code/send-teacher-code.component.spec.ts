import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SendTeacherCodeComponent } from './send-teacher-code.component';

describe('SendTeacherCodeComponent', () => {
  let component: SendTeacherCodeComponent;
  let fixture: ComponentFixture<SendTeacherCodeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SendTeacherCodeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SendTeacherCodeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
