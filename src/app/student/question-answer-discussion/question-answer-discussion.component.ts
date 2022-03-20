import { AfterViewInit, Component, HostListener, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Timestamp } from 'firebase/firestore';
import { MessageService } from 'primeng/api';
import { DialogService } from 'primeng/dynamicdialog';
import { BehaviorSubject } from 'rxjs';
import { DiscussionAnswer } from 'src/app/interface/discussion-answer';
import { DiscussionQuestion } from 'src/app/interface/discussion-question';
import { DiscussionQuestionWithAnswer } from 'src/app/interface/discussion-question-with-answer';
import { DownVotedBy } from 'src/app/interface/down-voted-by';
import { NewDiscussionQuestion } from 'src/app/interface/new-discussion-question';
import { UpVotedBy } from 'src/app/interface/up-voted-by';
import { AuthService } from 'src/app/service/auth.service';
import { DiscussionQuestionComponentComponent } from '../discussion-question-component/discussion-question-component.component';

@Component({
  selector: 'app-question-answer-discussion',
  templateUrl: './question-answer-discussion.component.html',
  styleUrls: ['./question-answer-discussion.component.css'],
  providers: [DialogService]
})
export class QuestionAnswerDiscussionComponent implements OnInit, AfterViewInit {

  loading: boolean = false;

  allDiscussionQuestions: DiscussionQuestionWithAnswer[] = [];
  limitedAllDiscussionQuestions: DiscussionQuestionWithAnswer[] = [];

  myDiscussionQuestions: DiscussionQuestionWithAnswer[] = [];
  limitedMyDiscussionQuestions: DiscussionQuestionWithAnswer[] = [];

  noOfAllQuestionsInPageThreshold: number = 2;
  noOfMyQuestionsInPageThreshold: number = 2;

  answerForm!: FormGroup;
  userId!: string;
  username!: string;

  questionChangedIndex: number = -1;

  screenWidth!: number;

  isMobileView: boolean = false;

  private screenWidth$ = new BehaviorSubject<number>(window.innerWidth);

  @HostListener('window:resize', ['$event'])
    onResize(event: any) {
        if (event.target.innerWidth < 510) {
          this.isMobileView = true;
        }
        else{
          this.isMobileView = false;
        }
    }

  constructor(public dialogService: DialogService, private authService: AuthService,
              private messageService: MessageService) { }

  ngAfterViewInit(): void {
    this.screenWidth$.subscribe(width => {
      if (width < 510) {
        this.isMobileView = true;
      }
      else{
        this.isMobileView = false;
      }
    });
  }

  ngOnInit(): void {
    this.answerForm = new FormGroup({
      'answer': new FormControl('')
    })
    
    this.loading = true;

    this.authService.getCurrentUser().subscribe(currentUser =>{
      this.userId = currentUser.uid
      this.username = currentUser.displayName;
    })


    //read all discussion questions
    this.authService.readDiscussionQuestionsTest().subscribe( (allDiscussionQuestions:NewDiscussionQuestion[]) =>{
      this.allDiscussionQuestions = []
      allDiscussionQuestions.forEach(discussionQuestion =>{
        discussionQuestion.questionAskedDate = (<Timestamp><unknown>discussionQuestion.questionAskedDate).toDate()
        let discussionQuestionWithAnswer : DiscussionQuestionWithAnswer ={
          discussionQuestion: discussionQuestion,
          allAnswers: [],
          limitedAnswers: [],
          upVotedBy: [],
          downVotedBy: []
        }

        //read question allAnswers list 
        discussionQuestionWithAnswer.allAnswers = []
        this.authService.fetchAllAnswersOfAQuestion(discussionQuestion.id).subscribe(allAnswers =>{
          discussionQuestionWithAnswer.allAnswers = allAnswers
          

          if(discussionQuestionWithAnswer.allAnswers.length > 0){
            discussionQuestionWithAnswer.allAnswers.sort((a,b) =>{
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

            discussionQuestionWithAnswer.allAnswers.forEach(answer =>{
              answer.answeredOn = (<Timestamp><unknown> answer.answeredOn).toDate();
            })

            discussionQuestionWithAnswer.limitedAnswers = discussionQuestionWithAnswer.allAnswers.slice(0,2);

            discussionQuestionWithAnswer.allAnswers.forEach(answer =>{
              this.authService.fetchUpVotedByOfAnAnswer(discussionQuestion.id, answer.id).subscribe(allUpVotedByListOfAnswer =>{
                answer.upVotedBy = allUpVotedByListOfAnswer
                answer.answerUpVotesCount =  allUpVotedByListOfAnswer.length

                this.authService.fetchDownVotedByOfAnAnswer(discussionQuestion.id, answer.id).subscribe(allDownVotedByListOfAnswer =>{
                  answer.downVotedBy = allDownVotedByListOfAnswer
                  answer.answerDownVotesCount =  allDownVotedByListOfAnswer.length

                  //check if user has upVoted this question
                  answer.isUpVotedByCurrentLoggedInUser = false;
                  answer.isDownVotedByCurrentLoggedInUser = false;

                  if(answer.upVotedBy.find((userId:UpVotedBy) => userId.userId === this.userId) !== undefined){
                    answer.isUpVotedByCurrentLoggedInUser = true;
                  }

                  if(answer.downVotedBy.find((userId:DownVotedBy) => userId.userId === this.userId) !== undefined){
                    answer.isDownVotedByCurrentLoggedInUser = true;
                  }
                })
              })
            })
          }



          //read question upVotedBy List
          this.authService.fetchUpVotedByOfAQuestion(discussionQuestion.id).subscribe(allUpVotedByList =>{
            discussionQuestionWithAnswer.upVotedBy = allUpVotedByList
            discussionQuestionWithAnswer.discussionQuestion.questionUpVotesCount =  allUpVotedByList.length


            //read question downVotedBy list
            this.authService.fetchDownVotedByOfAQuestion(discussionQuestion.id).subscribe(allDownVotedByList =>{
              discussionQuestionWithAnswer.downVotedBy = allDownVotedByList
              discussionQuestionWithAnswer.discussionQuestion.questionDownVotesCount = allDownVotedByList.length

              //check if user has upVoted this question
              discussionQuestion.isUpVotedByCurrentLoggedInUser = false;
              discussionQuestion.isDownVotedByCurrentLoggedInUser = false;

              if(discussionQuestionWithAnswer.upVotedBy.find((userId:UpVotedBy) => userId.userId === this.userId) !== undefined){
                discussionQuestionWithAnswer.discussionQuestion.isUpVotedByCurrentLoggedInUser = true;
              }

              if(discussionQuestionWithAnswer.downVotedBy.find((userId:DownVotedBy) => userId.userId === this.userId) !== undefined){
                discussionQuestionWithAnswer.discussionQuestion.isDownVotedByCurrentLoggedInUser = true;
              }
            })
          })
        })

        this.allDiscussionQuestions.push(discussionQuestionWithAnswer)
      })

      this.allDiscussionQuestions.sort((a,b) =>{
        if(a.discussionQuestion.questionAskedDate === b.discussionQuestion.questionAskedDate){
          return 0
        }
        else if(a.discussionQuestion.questionAskedDate > b.discussionQuestion.questionAskedDate){
          return -1
        }
        else{
          return 1
        }
      })

      this.myDiscussionQuestions = this.allDiscussionQuestions.filter(question => question.discussionQuestion.questionAskedBy === this.userId)
      this.limitedMyDiscussionQuestions = this.myDiscussionQuestions.slice(0,this.noOfMyQuestionsInPageThreshold);
      this.limitedAllDiscussionQuestions = this.allDiscussionQuestions.slice(0,this.noOfAllQuestionsInPageThreshold);
      this.loading = false;


      //read all upVotedBy array

    })
  }

  addDiscussionQuestion(){
    this.answerForm.reset()
    const ref = this.dialogService.open(DiscussionQuestionComponentComponent, {
        header: 'Ask a question',
        width: '70%'
    });

    ref.onClose.subscribe((question: string) => {
      if (question) {
      }
    });
  }

  increaseUpVoteCount(questionId: string, questionIndex: number){

    let currentQuestionIndex: number =  this.allDiscussionQuestions.findIndex(question => question.discussionQuestion.id === questionId)

    //first removeDownVote by the user
    this.authService.decreaseDownVoteCount(questionId, this.userId).subscribe(removedDownVote =>{
    })

    //already upvoted by the user
    if(this.allDiscussionQuestions[currentQuestionIndex].upVotedBy.find((userId:any) => userId.userId === this.userId) !== undefined){
      //remove upVote by the user
      this.authService.decreaseUpVoteCount(questionId, this.userId).subscribe(removedUpVote =>{
      })
    }
    else{
      this.authService.increaseUpVoteCount(questionId, this.userId).subscribe(questionUpVoted =>{
      })
    }
  }

  increaseDownVoteCount(questionId: string, questionIndex: number){

    let currentQuestionIndex: number =  this.allDiscussionQuestions.findIndex(question => question.discussionQuestion.id === questionId)

    //first removeUpVote by the user
    this.authService.decreaseUpVoteCount(questionId, this.userId).subscribe(removedUpVote =>{
    })

    //already downvoted by the user
    if(this.allDiscussionQuestions[currentQuestionIndex].downVotedBy.find((userId:any) => userId.userId === this.userId) !== undefined){
      //remove downVote by the user
      this.authService.decreaseDownVoteCount(questionId, this.userId).subscribe(removedDownVote =>{
      })
    }
    else{
      this.authService.increaseDownVoteCount(questionId, this.userId).subscribe(questionDownVoted =>{
      })
    }
  }

  submitAnswer(questionId: string){

    if(this.answerForm.get('answer')?.value !== ''){
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

      this.authService.addAnswer(questionId,answerData).subscribe(answerAdded =>{
        this.messageService.add({severity:'success', summary: 'Answer Submitted Successfully'});
        this.answerForm.reset()
        this.questionChangedIndex = -1;
        //this.ngOnInit()
      })
    }
    else{
      this.messageService.add({severity:'error', summary: 'Please write a comment.'})
    }
  }

  answerFieldChanged(event: any, questionChangedIndex: number){
    if(event.target.value.length === 0){
      this.questionChangedIndex = -1
    }
    else{
      this.questionChangedIndex = questionChangedIndex
    }
  }

  increaseUpVoteCountOfAnswer(questionId: string, answerId: string, questionIndex: number, answerIndex: number){

    let currentQuestionIndex: number =  this.allDiscussionQuestions.findIndex(question => question.discussionQuestion.id === questionId)

    //first removeDownVote by the user
    this.authService.decreaseDownVoteCountOfAnAnswer(questionId, answerId, this.userId).subscribe(removedDownVoteOfAnswer =>{
    })

    //already upvoted by the user
    if(this.allDiscussionQuestions[currentQuestionIndex].allAnswers[answerIndex].upVotedBy.find((userId:any) => userId.userId === this.userId) !== undefined){
      //remove upVote by the user
      this.authService.decreaseUpVoteCountOfAnAnswer(questionId, answerId, this.userId).subscribe(removedUpVoteOfAnswer =>{
      })
    }
    else{
      this.authService.increaseUpVoteCountOfAnAnswer(questionId, answerId, this.userId).subscribe(answerUpVoted =>{
      })
    }
  }

  increaseDownVoteCountOfAnswer(questionId: string, answerId: string, questionIndex: number, answerIndex: number){

    let currentQuestionIndex: number =  this.allDiscussionQuestions.findIndex(question => question.discussionQuestion.id === questionId)

    //first removeUpVote by the user
    this.authService.decreaseUpVoteCountOfAnAnswer(questionId, answerId, this.userId).subscribe(removedUpVoteOfAnswer =>{
    })

    //already downvoted by the user
    if(this.allDiscussionQuestions[currentQuestionIndex].allAnswers[answerIndex].downVotedBy.find((userId:any) => userId.userId === this.userId) !== undefined){
      //remove downVote by the user
      this.authService.decreaseDownVoteCountOfAnAnswer(questionId, answerId, this.userId).subscribe(removedDownVoteOfAnswer =>{
      })
    }
    else{
      this.authService.increaseDownVoteCountOfAnAnswer(questionId, answerId, this.userId).subscribe(answerDownVoted =>{
      })
    }
  }

  loadMoreAllDiscussionQuestions(){
    this.noOfAllQuestionsInPageThreshold += 2;
    this.limitedAllDiscussionQuestions = this.allDiscussionQuestions.slice(0,this.noOfAllQuestionsInPageThreshold);
  }

  loadMoreMyDiscussionQuestions(){
    this.noOfMyQuestionsInPageThreshold += 2;
    this.limitedMyDiscussionQuestions = this.myDiscussionQuestions.slice(0,this.noOfMyQuestionsInPageThreshold);
  }

  loadMoreAllDiscussionAnswers(questionId: string){

    let currentQuestionIndex: number =  this.allDiscussionQuestions.findIndex(question => question.discussionQuestion.id === questionId)
    let currentLimitedAnswersLength = this.allDiscussionQuestions[currentQuestionIndex].limitedAnswers.length;
    this.allDiscussionQuestions[currentQuestionIndex].limitedAnswers = this.allDiscussionQuestions[currentQuestionIndex].
                                                      allAnswers.slice(0,currentLimitedAnswersLength+2)
  }

  loadMoreMyDiscussionAnswers(questionId: string){

    let currentQuestionIndex: number =  this.myDiscussionQuestions.findIndex(question => question.discussionQuestion.id === questionId)
    let currentLimitedAnswersLength = this.myDiscussionQuestions[currentQuestionIndex].limitedAnswers.length;
    this.myDiscussionQuestions[currentQuestionIndex].limitedAnswers = this.myDiscussionQuestions[currentQuestionIndex].
                                                      allAnswers.slice(0,currentLimitedAnswersLength+2)
  }

}
