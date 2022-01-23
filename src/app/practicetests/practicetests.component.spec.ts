import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PracticetestsComponent } from './practicetests.component';

describe('PracticetestsComponent', () => {
  let component: PracticetestsComponent;
  let fixture: ComponentFixture<PracticetestsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PracticetestsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PracticetestsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
