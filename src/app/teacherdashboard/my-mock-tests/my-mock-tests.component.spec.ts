import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MyMockTestsComponent } from './my-mock-tests.component';

describe('MyMockTestsComponent', () => {
  let component: MyMockTestsComponent;
  let fixture: ComponentFixture<MyMockTestsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MyMockTestsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MyMockTestsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
