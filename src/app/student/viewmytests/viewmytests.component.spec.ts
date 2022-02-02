import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewmytestsComponent } from './viewmytests.component';

describe('ViewmytestsComponent', () => {
  let component: ViewmytestsComponent;
  let fixture: ComponentFixture<ViewmytestsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewmytestsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewmytestsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
