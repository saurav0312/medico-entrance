import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChoosesignupoptionComponent } from './choosesignupoption.component';

describe('ChoosesignupoptionComponent', () => {
  let component: ChoosesignupoptionComponent;
  let fixture: ComponentFixture<ChoosesignupoptionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChoosesignupoptionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChoosesignupoptionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
