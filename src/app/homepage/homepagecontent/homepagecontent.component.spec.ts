import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HomepagecontentComponent } from './homepagecontent.component';

describe('HomepagecontentComponent', () => {
  let component: HomepagecontentComponent;
  let fixture: ComponentFixture<HomepagecontentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HomepagecontentComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HomepagecontentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
