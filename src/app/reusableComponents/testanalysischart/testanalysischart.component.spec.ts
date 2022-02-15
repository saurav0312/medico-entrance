import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TestanalysischartComponent } from './testanalysischart.component';

describe('TestanalysischartComponent', () => {
  let component: TestanalysischartComponent;
  let fixture: ComponentFixture<TestanalysischartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TestanalysischartComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TestanalysischartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
