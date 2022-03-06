import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Timestamp } from 'firebase/firestore';
import { MessageService } from 'primeng/api';
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

  constructor(public dialogService: DialogService, private authService: AuthService,
              private messageService: MessageService) { }

  ngOnInit(): void {

    this.answerForm = new FormGroup({
      'answer': new FormControl('', Validators.required)
    })

    this.loading = true;

    this.authService.getCurrentUser().subscribe(currentUser =>{
      this.userId = currentUser.uid
    })

    this.authService.readDiscussionQuestions().subscribe( (allDiscussionQuestions:DiscussionQuestion[]) =>{
      console.log("All discussion questions: ", allDiscussionQuestions)
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

        if(question.upVotedBy.find(userId => userId === this.userId) !== undefined){
          question.isUpVotedByCurrentLoggedInUser = true;
        }

        if(question.downVotedBy.find(userId => userId === this.userId) !== undefined){
          question.isDownVotedByCurrentLoggedInUser = true;
        }
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
    }
  });

  }

  increaseUpVoteCount(questionIndex: number){

    if(this.allDiscussionQuestions[questionIndex].isDownVotedByCurrentLoggedInUser){
      this.removeDownVotedByUser(questionIndex)
    }

    //already liked by the user so decrease the upvote count and make isUpVotedByCurrentLoggedInUser false
    if(this.allDiscussionQuestions[questionIndex].isUpVotedByCurrentLoggedInUser){
      this.removeUpVotedByUser(questionIndex);
    }
    // first time liked so increase the upvote count and make isUpVotedByCurrentLoggedInUser true
    else{
      this.addUpVotedByUser(questionIndex)
    }

    this.allDiscussionQuestions[questionIndex].isDownVotedByCurrentLoggedInUser = false;
    this.allDiscussionQuestions[questionIndex].isUpVotedByCurrentLoggedInUser = false;
    this.authService.updateDiscussionQuestion(this.allDiscussionQuestions[questionIndex].id ,this.allDiscussionQuestions[questionIndex]).subscribe(response =>{
    })
  }

  removeUpVotedByUser(questionIndex: number){
    this.allDiscussionQuestions[questionIndex].questionUpVotesCount -= 1;
    //this.allDiscussionQuestions[questionIndex].isUpVotedByCurrentLoggedInUser = false;
    this.allDiscussionQuestions[questionIndex].upVotedBy = this.allDiscussionQuestions[questionIndex].upVotedBy.filter(userId => userId !== this.userId)
  }

  addUpVotedByUser(questionIndex: number){
    this.allDiscussionQuestions[questionIndex].questionUpVotesCount += 1;
    this.allDiscussionQuestions[questionIndex].upVotedBy.push(this.userId);
    //this.allDiscussionQuestions[questionIndex].isUpVotedByCurrentLoggedInUser = true;
  }

  increaseDownVoteCount(questionIndex: number){

    if(this.allDiscussionQuestions[questionIndex].isUpVotedByCurrentLoggedInUser){
      this.removeUpVotedByUser(questionIndex);
    }

    //already disliked by the user so decrease the downvote count and make isDownVotedByCurrentLoggedInUser false
    if(this.allDiscussionQuestions[questionIndex].isDownVotedByCurrentLoggedInUser){
      this.removeDownVotedByUser(questionIndex)
    }
    // first time disliked so increase the downvote count and make isDOwnVotedByCurrentLoggedInUser true
    else{
      this.addDownVotedByUser(questionIndex)
    }

    this.allDiscussionQuestions[questionIndex].isDownVotedByCurrentLoggedInUser = false;
    this.allDiscussionQuestions[questionIndex].isUpVotedByCurrentLoggedInUser = false;
    this.authService.updateDiscussionQuestion(this.allDiscussionQuestions[questionIndex].id ,this.allDiscussionQuestions[questionIndex]).subscribe(response =>{
    })
  }

  removeDownVotedByUser(questionIndex: number){
    this.allDiscussionQuestions[questionIndex].questionDownVotesCount -= 1;
    //this.allDiscussionQuestions[questionIndex].isDownVotedByCurrentLoggedInUser = false;
    this.allDiscussionQuestions[questionIndex].downVotedBy = this.allDiscussionQuestions[questionIndex].downVotedBy.filter(userId => userId !== this.userId)
  }

  addDownVotedByUser(questionIndex: number){
    this.allDiscussionQuestions[questionIndex].questionDownVotesCount += 1;
    //this.allDiscussionQuestions[questionIndex].isDownVotedByCurrentLoggedInUser = true;
    this.allDiscussionQuestions[questionIndex].downVotedBy.push(this.userId);
  }

  submitAnswer(questionIndex: number){
    let answerData: DiscussionAnswer={
      'answer': this.answerForm.get('answer')?.value,
      'answeredBy': this.userId,
      'answeredOn': new Date(),
      'answerUpVotesCount': 0,
      'answerDownVotesCount': 0 
    }
    this.allDiscussionQuestions[questionIndex].allAnswers.push(answerData);
    this.authService.updateDiscussionQuestion(this.allDiscussionQuestions[questionIndex].id ,this.allDiscussionQuestions[questionIndex]).subscribe(response =>{
      this.messageService.add({severity:'success', summary: 'Answer Submitted Successfully'});
    })
    // this.answerForm.get('answer')?.setValue('');
    this.answerForm.reset()
  }

}
