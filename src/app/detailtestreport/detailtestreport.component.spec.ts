import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailtestreportComponent } from './detailtestreport.component';

describe('DetailtestreportComponent', () => {
  let component: DetailtestreportComponent;
  let fixture: ComponentFixture<DetailtestreportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DetailtestreportComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DetailtestreportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
