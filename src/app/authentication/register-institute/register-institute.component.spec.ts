import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegisterInstituteComponent } from './register-institute.component';

describe('RegisterInstituteComponent', () => {
  let component: RegisterInstituteComponent;
  let fixture: ComponentFixture<RegisterInstituteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RegisterInstituteComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RegisterInstituteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
