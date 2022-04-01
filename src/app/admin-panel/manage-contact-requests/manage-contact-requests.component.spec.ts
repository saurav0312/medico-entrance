import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageContactRequestsComponent } from './manage-contact-requests.component';

describe('ManageContactRequestsComponent', () => {
  let component: ManageContactRequestsComponent;
  let fixture: ComponentFixture<ManageContactRequestsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ManageContactRequestsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ManageContactRequestsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
