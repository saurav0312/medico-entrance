import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewPageDesignComponent } from './new-page-design.component';

describe('NewPageDesignComponent', () => {
  let component: NewPageDesignComponent;
  let fixture: ComponentFixture<NewPageDesignComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NewPageDesignComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NewPageDesignComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
