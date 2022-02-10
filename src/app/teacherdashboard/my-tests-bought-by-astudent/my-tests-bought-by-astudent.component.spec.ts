import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MyTestsBoughtByAStudentComponent } from './my-tests-bought-by-astudent.component';

describe('MyTestsBoughtByAStudentComponent', () => {
  let component: MyTestsBoughtByAStudentComponent;
  let fixture: ComponentFixture<MyTestsBoughtByAStudentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MyTestsBoughtByAStudentComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MyTestsBoughtByAStudentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
