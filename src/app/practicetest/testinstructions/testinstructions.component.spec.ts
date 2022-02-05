import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TestinstructionsComponent } from './testinstructions.component';

describe('TestinstructionsComponent', () => {
  let component: TestinstructionsComponent;
  let fixture: ComponentFixture<TestinstructionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TestinstructionsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TestinstructionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
