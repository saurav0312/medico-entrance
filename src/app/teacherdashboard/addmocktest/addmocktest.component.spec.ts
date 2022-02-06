import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddmocktestComponent } from './addmocktest.component';

describe('AddmocktestComponent', () => {
  let component: AddmocktestComponent;
  let fixture: ComponentFixture<AddmocktestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddmocktestComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddmocktestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
