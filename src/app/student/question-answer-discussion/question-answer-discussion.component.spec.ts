import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuestionAnswerDiscussionComponent } from './question-answer-discussion.component';

describe('QuestionAnswerDiscussionComponent', () => {
  let component: QuestionAnswerDiscussionComponent;
  let fixture: ComponentFixture<QuestionAnswerDiscussionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ QuestionAnswerDiscussionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(QuestionAnswerDiscussionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
