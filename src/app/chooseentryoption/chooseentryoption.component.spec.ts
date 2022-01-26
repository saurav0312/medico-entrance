import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChooseEntryOptionComponent } from './chooseentryoption.component';

describe('chooseentryoption', () => {
  let component: ChooseEntryOptionComponent;
  let fixture: ComponentFixture<ChooseEntryOptionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChooseEntryOptionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChooseEntryOptionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
