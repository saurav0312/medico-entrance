import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Timestamp } from 'firebase/firestore';
import { DialogService } from 'primeng/dynamicdialog';
import { DiscussionAnswer } from 'src/app/interface/discussion-answer';
import { DiscussionQuestion } from 'src/app/interface/discussion-question';
import { AuthService } from 'src/app/service/auth.service';
import { DiscussionQuestionComponentComponent } from '../discussion-question-component/discussion-question-component.component';

@Component({
  selector: 'app-question-answer-discussion',
  templateUrl: './question-answer-discussion.component.html',
  styleUrls: ['./question-answer-discussion.component.css'],
  providers: [DialogService]
})
export class QuestionAnswerDiscussionComponent implements OnInit {

  loading: boolean = false;

  allDiscussionQuestions: DiscussionQuestion[] = [];

  answerForm!: FormGroup;
  userId!: string;

  constructor(public dialogService: DialogService, private authService: AuthService) { }

  ngOnInit(): void {

    this.answerForm = new FormGroup({
      'answer': new FormControl('', Validators.required)
    })

    this.loading = true;

    this.authService.getCurrentUser().subscribe(currentUser =>{
      this.userId = currentUser.uid
    })

    this.authService.readDiscussionQuestions().subscribe( (allDiscussionQuestions:DiscussionQuestion[]) =>{
      console.log("Discussion questions: ", allDiscussionQuestions)
      this.allDiscussionQuestions = allDiscussionQuestions
      this.allDiscussionQuestions.sort((a,b) =>{
        if(a.questionAskedDate < b.questionAskedDate){
          return 1
        }
        else if(a.questionAskedDate > b.questionAskedDate){
          return -1
        }
        else{
          return 0
        }
      })
      this.allDiscussionQuestions.forEach(question =>{
        question.questionAskedDate = (<Timestamp><unknown>question.questionAskedDate).toDate()
        if(question.allAnswers.length > 0){

          question.allAnswers.sort((a,b) =>{
            if(a.answeredOn < b.answeredOn){
              return 1
            }
            else if(a.answeredOn > b.answeredOn){
              return -1
            }
            else{
              return 0
            }
          })

          question.allAnswers.forEach(answer =>{
            answer.answeredOn = (<Timestamp><unknown> answer.answeredOn).toDate();
          })
        }
      })
    })
    this.loading = false;
  }

  addDiscussionQuestion(){
  const ref = this.dialogService.open(DiscussionQuestionComponentComponent, {
      header: 'Add a question',
      width: '70%'
  });

  ref.onClose.subscribe((question: string) => {
    if (question) {
        console.log("Question: ", question)
    }
  });

  }

  increaseUpVoteCount(questionIndex: number){
    this.allDiscussionQuestions[questionIndex].questionUpVotesCount += 1;
    console.log("Value updated: ",  this.allDiscussionQuestions[questionIndex].questionUpVotesCount)
  }

  decreaseUpVoteCount(questionIndex: number){
    this.allDiscussionQuestions[questionIndex].questionDownVotesCount += 1;
  }

  submitAnswer(questionIndex: number){
    console.log("Answer form data: ", this.answerForm.value)
    let answerData: DiscussionAnswer={
      'answer': this.answerForm.get('answer')?.value,
      'answeredBy': this.userId,
      'answeredOn': new Date(),
      'answerUpVotesCount': 0,
      'answerDownVotesCount': 0 
    }
    this.allDiscussionQuestions[questionIndex].allAnswers.push(answerData);
    this.authService.updateDiscussionQuestion(this.allDiscussionQuestions[questionIndex].id ,this.allDiscussionQuestions[questionIndex]).subscribe(response =>{
      console.log("Answer uploaded");
    })
    // this.answerForm.get('answer')?.setValue('');
    this.answerForm.reset()
  }

}
