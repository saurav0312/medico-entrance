import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AllPracticeTestsComponent } from './all-practice-tests.component';

describe('AllPracticeTestsComponent', () => {
  let component: AllPracticeTestsComponent;
  let fixture: ComponentFixture<AllPracticeTestsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AllPracticeTestsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AllPracticeTestsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
