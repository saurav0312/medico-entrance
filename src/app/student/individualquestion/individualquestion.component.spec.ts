import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IndividualquestionComponent } from './individualquestion.component';

describe('IndividualquestionComponent', () => {
  let component: IndividualquestionComponent;
  let fixture: ComponentFixture<IndividualquestionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IndividualquestionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(IndividualquestionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
