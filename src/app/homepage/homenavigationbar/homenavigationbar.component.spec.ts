import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HomenavigationbarComponent } from './homenavigationbar.component';

describe('HomenavigationbarComponent', () => {
  let component: HomenavigationbarComponent;
  let fixture: ComponentFixture<HomenavigationbarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HomenavigationbarComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HomenavigationbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
