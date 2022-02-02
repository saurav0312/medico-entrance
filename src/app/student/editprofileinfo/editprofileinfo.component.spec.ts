import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditprofileinfoComponent } from './editprofileinfo.component';

describe('EditprofileinfoComponent', () => {
  let component: EditprofileinfoComponent;
  let fixture: ComponentFixture<EditprofileinfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditprofileinfoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditprofileinfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
