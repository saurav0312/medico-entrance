import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeletemocktestComponent } from './deletemocktest.component';

describe('DeletemocktestComponent', () => {
  let component: DeletemocktestComponent;
  let fixture: ComponentFixture<DeletemocktestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DeletemocktestComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DeletemocktestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
