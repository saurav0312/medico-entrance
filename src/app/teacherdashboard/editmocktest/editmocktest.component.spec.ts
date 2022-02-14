import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditmocktestComponent } from './editmocktest.component';

describe('EditmocktestComponent', () => {
  let component: EditmocktestComponent;
  let fixture: ComponentFixture<EditmocktestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditmocktestComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditmocktestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
