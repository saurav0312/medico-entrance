import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StarttestComponent } from './starttest.component';

describe('StarttestComponent', () => {
  let component: StarttestComponent;
  let fixture: ComponentFixture<StarttestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StarttestComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StarttestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
