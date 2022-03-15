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

  myDiscussionQuestions: DiscussionQuestion[] = [];

  answerForm!: FormGroup;
  userId!: string;
  username!: string;

  constructor(public dialogService: DialogService, private authService: AuthService,
              private messageService: MessageService) { }

  ngOnInit(): void {

    this.answerForm = new FormGroup({
      'answer': new FormControl('', Validators.required)
    })

    this.loading = true;

    this.authService.getCurrentUser().subscribe(currentUser =>{
      this.userId = currentUser.uid
      this.username = currentUser.displayName;
    })

    this.authService.readDiscussionQuestions().subscribe( (allDiscussionQuestions:DiscussionQuestion[]) =>{
      this.allDiscussionQuestions = allDiscussionQuestions

      this.loading = false;

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

        question.allAnswers.forEach(answer =>{
          if(answer.upVotedBy.find(userId => userId === this.userId) !== undefined){
            answer.isUpVotedByCurrentLoggedInUser = true;
          }

          if(answer.downVotedBy.find(userId => userId === this.userId) !== undefined){
            answer.isDownVotedByCurrentLoggedInUser = true;
          }
        })

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

      this.myDiscussionQuestions = this.allDiscussionQuestions.filter(question => question.questionAskedBy === this.userId)
    })
  }

  addDiscussionQuestion(){
  const ref = this.dialogService.open(DiscussionQuestionComponentComponent, {
      header: 'Ask a question',
      width: '70%'
  });

  ref.onClose.subscribe((question: string) => {
    if (question) {
    }
  });

  }

  //upvote and downvote of question
  increaseUpVoteCount(questionId: string){

    let currentQuestionIndex: number =  this.allDiscussionQuestions.findIndex(question => question.id === questionId)

    if(this.allDiscussionQuestions[currentQuestionIndex].isDownVotedByCurrentLoggedInUser){
      this.removeDownVotedByUser(currentQuestionIndex)
    }

    //already liked by the user so decrease the upvote count and make isUpVotedByCurrentLoggedInUser false
    if(this.allDiscussionQuestions[currentQuestionIndex].isUpVotedByCurrentLoggedInUser){
      this.removeUpVotedByUser(currentQuestionIndex);
    }
    // first time liked so increase the upvote count and make isUpVotedByCurrentLoggedInUser true
    else{
      this.addUpVotedByUser(currentQuestionIndex)
    }

    this.allDiscussionQuestions[currentQuestionIndex].isDownVotedByCurrentLoggedInUser = false;
    this.allDiscussionQuestions[currentQuestionIndex].isUpVotedByCurrentLoggedInUser = false;
    this.authService.updateDiscussionQuestion(this.allDiscussionQuestions[currentQuestionIndex].id ,this.allDiscussionQuestions[currentQuestionIndex]).subscribe(response =>{
    })
  }

  removeUpVotedByUser(questionIndex: number){
    this.allDiscussionQuestions[questionIndex].questionUpVotesCount -= 1;
    this.allDiscussionQuestions[questionIndex].upVotedBy = this.allDiscussionQuestions[questionIndex].upVotedBy.filter(userId => userId !== this.userId)
  }

  addUpVotedByUser(questionIndex: number){
    this.allDiscussionQuestions[questionIndex].questionUpVotesCount += 1;
    this.allDiscussionQuestions[questionIndex].upVotedBy.push(this.userId);
  }

  increaseDownVoteCount(questionId: string){

    let currentQuestionIndex: number =  this.allDiscussionQuestions.findIndex(question => question.id === questionId)

    if(this.allDiscussionQuestions[currentQuestionIndex].isUpVotedByCurrentLoggedInUser){
      this.removeUpVotedByUser(currentQuestionIndex);
    }

    //already disliked by the user so decrease the downvote count and make isDownVotedByCurrentLoggedInUser false
    if(this.allDiscussionQuestions[currentQuestionIndex].isDownVotedByCurrentLoggedInUser){
      this.removeDownVotedByUser(currentQuestionIndex)
    }
    // first time disliked so increase the downvote count and make isDOwnVotedByCurrentLoggedInUser true
    else{
      this.addDownVotedByUser(currentQuestionIndex)
    }

    this.allDiscussionQuestions[currentQuestionIndex].isDownVotedByCurrentLoggedInUser = false;
    this.allDiscussionQuestions[currentQuestionIndex].isUpVotedByCurrentLoggedInUser = false;
    this.authService.updateDiscussionQuestion(this.allDiscussionQuestions[currentQuestionIndex].id ,this.allDiscussionQuestions[currentQuestionIndex]).subscribe(response =>{
    })
  }

  removeDownVotedByUser(questionIndex: number){
    this.allDiscussionQuestions[questionIndex].questionDownVotesCount -= 1;
    this.allDiscussionQuestions[questionIndex].downVotedBy = this.allDiscussionQuestions[questionIndex].downVotedBy.filter(userId => userId !== this.userId)
  }

  addDownVotedByUser(questionIndex: number){
    this.allDiscussionQuestions[questionIndex].questionDownVotesCount += 1;
    this.allDiscussionQuestions[questionIndex].downVotedBy.push(this.userId);
  }

  submitAnswer(questionId: string){
    let answerData: DiscussionAnswer={
      'answer': this.answerForm.get('answer')?.value,
      'answeredBy': this.userId,
      'answeredByUsername': this.username,
      'answeredOn': new Date(),
      'answerUpVotesCount': 0,
      'answerDownVotesCount': 0,
      'upVotedBy': [],
      'downVotedBy': [],
      'isUpVotedByCurrentLoggedInUser': false,
      'isDownVotedByCurrentLoggedInUser': false 
    }

    let currentQuestionIndex: number =  this.allDiscussionQuestions.findIndex(question => question.id === questionId)
    this.allDiscussionQuestions[currentQuestionIndex].allAnswers.push(answerData);
    this.authService.updateDiscussionQuestion(this.allDiscussionQuestions[currentQuestionIndex].id ,this.allDiscussionQuestions[currentQuestionIndex]).subscribe(response =>{
      this.messageService.add({severity:'success', summary: 'Answer Submitted Successfully'});
    })
    this.answerForm.reset()
  }


  //upvote and downvote of answer
  increaseUpVoteCountofAnswer(questionId: string, answerIndex: number){

    let currentQuestionIndex: number =  this.allDiscussionQuestions.findIndex(question => question.id === questionId)

    if(this.allDiscussionQuestions[currentQuestionIndex].allAnswers[answerIndex].isDownVotedByCurrentLoggedInUser){
      this.removeDownVotedByUserOfAnswer(currentQuestionIndex, answerIndex)
    }

    //already liked by the user so decrease the upvote count and make isUpVotedByCurrentLoggedInUser false
    if(this.allDiscussionQuestions[currentQuestionIndex].allAnswers[answerIndex].isUpVotedByCurrentLoggedInUser){
      this.removeUpVotedByUserOfAnswer(currentQuestionIndex, answerIndex);
    }
    // first time liked so increase the upvote count and make isUpVotedByCurrentLoggedInUser true
    else{
      this.addUpVotedByUserOfAnswer(currentQuestionIndex, answerIndex)
    }

    this.allDiscussionQuestions[currentQuestionIndex].allAnswers[answerIndex].isDownVotedByCurrentLoggedInUser = false;
    this.allDiscussionQuestions[currentQuestionIndex].allAnswers[answerIndex].isUpVotedByCurrentLoggedInUser = false;
    this.authService.updateDiscussionQuestion(this.allDiscussionQuestions[currentQuestionIndex].id ,this.allDiscussionQuestions[currentQuestionIndex]).subscribe(response =>{
    })
  }

  removeUpVotedByUserOfAnswer(questionIndex: number, answerIndex: number){
    this.allDiscussionQuestions[questionIndex].allAnswers[answerIndex].answerUpVotesCount -= 1;
    this.allDiscussionQuestions[questionIndex].allAnswers[answerIndex].upVotedBy = this.allDiscussionQuestions[questionIndex].allAnswers[answerIndex].upVotedBy.filter(userId => userId !== this.userId)
  }

  addUpVotedByUserOfAnswer(questionIndex: number, answerIndex: number){
    this.allDiscussionQuestions[questionIndex].allAnswers[answerIndex].answerUpVotesCount += 1;
    this.allDiscussionQuestions[questionIndex].allAnswers[answerIndex].upVotedBy.push(this.userId);
  }

  increaseDownVoteCountOfAnswer(questionId: string, answerIndex: number){

    let currentQuestionIndex: number =  this.allDiscussionQuestions.findIndex(question => question.id === questionId)

    if(this.allDiscussionQuestions[currentQuestionIndex].allAnswers[answerIndex].isUpVotedByCurrentLoggedInUser){
      this.removeUpVotedByUserOfAnswer(currentQuestionIndex, answerIndex);
    }

    //already disliked by the user so decrease the downvote count and make isDownVotedByCurrentLoggedInUser false
    if(this.allDiscussionQuestions[currentQuestionIndex].allAnswers[answerIndex].isDownVotedByCurrentLoggedInUser){
      this.removeDownVotedByUserOfAnswer(currentQuestionIndex, answerIndex)
    }
    // first time disliked so increase the downvote count and make isDOwnVotedByCurrentLoggedInUser true
    else{
      this.addDownVotedByUserOfAnswer(currentQuestionIndex, answerIndex)
    }

    this.allDiscussionQuestions[currentQuestionIndex].allAnswers[answerIndex].isDownVotedByCurrentLoggedInUser = false;
    this.allDiscussionQuestions[currentQuestionIndex].allAnswers[answerIndex].isUpVotedByCurrentLoggedInUser = false;
    this.authService.updateDiscussionQuestion(this.allDiscussionQuestions[currentQuestionIndex].id ,this.allDiscussionQuestions[currentQuestionIndex]).subscribe(response =>{
    })
  }

  removeDownVotedByUserOfAnswer(questionIndex: number, answerIndex: number){
    this.allDiscussionQuestions[questionIndex].allAnswers[answerIndex].answerDownVotesCount -= 1;
    this.allDiscussionQuestions[questionIndex].allAnswers[answerIndex].downVotedBy = this.allDiscussionQuestions[questionIndex].allAnswers[answerIndex].downVotedBy.filter(userId => userId !== this.userId)
  }

  addDownVotedByUserOfAnswer(questionIndex: number, answerIndex: number){
    this.allDiscussionQuestions[questionIndex].allAnswers[answerIndex].answerDownVotesCount += 1;
    this.allDiscussionQuestions[questionIndex].allAnswers[answerIndex].downVotedBy.push(this.userId);
  }

}
