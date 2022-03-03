import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DiscussionQuestionComponentComponent } from './discussion-question-component.component';

describe('DiscussionQuestionComponentComponent', () => {
  let component: DiscussionQuestionComponentComponent;
  let fixture: ComponentFixture<DiscussionQuestionComponentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DiscussionQuestionComponentComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DiscussionQuestionComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
