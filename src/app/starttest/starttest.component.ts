import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { MockTest } from '../interface/mockTest';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../service/auth.service';
import { interval, Observable, Subscription } from 'rxjs';

@Component({
  selector: 'app-starttest',
  templateUrl: './starttest.component.html',
  styleUrls: ['./starttest.component.css']
})
export class StarttestComponent implements OnInit, OnDestroy {

  @Input() testId!: string;
  testData!: MockTest;
  counter = 0;
  totalTimeRemaining = 60;
  countDownSubscription$!: Subscription;
  testFinished : boolean = false;
  noOfQuestionsAnsweredCorrectly! : number;
  noOfQuestionsAnsweredIncorrectly! : number;
  noOfQuestionsAttempted! : number;
  noOfQuestionsUnattempted! : number

  constructor(
    private router : Router,
    private route: ActivatedRoute,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    this.route.queryParams.subscribe((params: any) =>{
      this.testId = <string>params.data
      this.authService.getMockTestByID(this.testId).subscribe(response=>{
        this.testData= response;
        // this.countDownSubscription$ = interval(1000).subscribe(x =>{
        //   this.totalTimeRemaining--;
        //   if(this.totalTimeRemaining === 0){
        //     this.testFinished= true;
        //     this.evaluateMarks(this.testData);
        //     console.log(this.testData)
        //   }
        // })
      })
      console.log("Query data", this.testId)
    })
  }

  evaluateMarks(testResult: MockTest): void{
    let questionsAnsweredCorrectly = 0;
    let questionsAnsweredIncorrectly = 0;
    let questionsAttempted = 0;

    testResult.questions.forEach(question =>{
      if(question.selectedOption!== undefined){
        questionsAttempted++;
        if(question.selectedOption === question.correctAnswer){
          questionsAnsweredCorrectly++;
        }
        else{
          questionsAnsweredIncorrectly++;
        }
      }
    });
    this.noOfQuestionsAnsweredCorrectly = questionsAnsweredCorrectly;
    this.noOfQuestionsAnsweredIncorrectly = questionsAnsweredIncorrectly;
    this.noOfQuestionsAttempted = questionsAttempted;
    this.noOfQuestionsUnattempted = testResult.questions.length - questionsAttempted;
  }

  ngOnDestroy(){
    this.countDownSubscription$.unsubscribe();
  }

  increaseCounter(): void{
    this.counter++;
    if(this.counter === this.testData.questions.length ){
      this.counter = this.testData.questions.length-1;
    }
  }

  decreaseCounter(): void{
    this.counter --;
    if(this.counter === -1){
      this.counter = 0;
    }
  }

  changeQuestion(questionIndex: number): void{
    this.counter = questionIndex
  }

  optionSelected(questionNumber:number, selectedOption:number): void{
    console.log("Question : " + questionNumber + " Option Selected: " + selectedOption)
    this.testData.questions[this.counter].selectedOption = selectedOption;
    this.testData.questions[this.counter].answered = true;
    console.log(this.testData.questions[this.counter]);
    console.log(this.testData.questions)
  }
}
