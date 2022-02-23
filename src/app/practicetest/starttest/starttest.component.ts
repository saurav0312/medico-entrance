import { Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MockTest } from '../../interface/mockTest';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../service/auth.service';
import { HttpClient } from '@angular/common/http';
import { TestReportData } from '../../interface/testReportData';
import { TestReportQuestion } from '../../interface/testReportQuestion';
import { Tests } from '../../interface/tests';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { SharedService } from '../../service/shared.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-starttest',
  templateUrl: './starttest.component.html',
  styleUrls: ['./starttest.component.css']
})
export class StarttestComponent implements OnInit, OnDestroy {

  displayedColumns: string[] = ['no', 'question', 'selectedOption', 'correctAnswer', 'result'];
  cols!: any[];

  @Input() testId!: string;

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  dataSource!: MatTableDataSource<TestReportQuestion>;
  
  testData!: MockTest;
  testReportDataToSend!: TestReportData;
  isYourFirstTest : boolean = true;
  viewResult: boolean = false;
  testToShowInTable! : Tests;

  counter = 0;
  totalTimeRemaining!: number;
  testFinished : boolean = false;
  noOfQuestionsAnsweredCorrectly! : number;
  noOfQuestionsAnsweredIncorrectly! : number;
  noOfQuestionsAttempted! : number;
  noOfQuestionsUnattempted! : number;
  intervalId!: any;
  userId!: string | undefined;
  realtimeDatabaseUrl! : string;  
  finalTestTimeInSeconds!: number;
  testTotalTime: number = 0;

  subscription!: Subscription
  isResultSubmitted: boolean = false;
  hour: number = 0;
  minutes: number = 0;
  seconds: number = 0;

  questionStartTime!: number ;
  questionEndTime!: number;

  constructor(
    private router : Router,
    private route: ActivatedRoute,
    private authService: AuthService,
    private httpClient : HttpClient,
    private sharedService: SharedService
  ) { }

  ngOnInit(): void {

    this.cols = [
      { field: 'question', header: 'Question' },
      { field: 'selectedOption', header: 'Selected Option' },
      { field: 'correctAnswer', header: 'Correct Answer' }
  ];

  this.dataSource = new MatTableDataSource();
    this.route.queryParams.subscribe((params: any) =>{
      this.testId = <string>params.data
      this.authService.getMockTestByID(this.testId).subscribe(response=>{
        this.testData= response;
        console.log("test data with image: ", this.testData)
        this.testTotalTime = this.testData.totalTime
        const sub = this.authService.getCurrentUser().subscribe(response =>{
          this.userId = response?.uid
          this.realtimeDatabaseUrl = this.authService.realtimeDatabaseUrl;
          sub.unsubscribe()
          this.authService.getAllMockTestsGivenByAUser(this.userId).subscribe(response =>{
            if(response !== undefined){
              this.isYourFirstTest = false;
            }

            this.subscription = this.authService.getTestFinishTime(this.userId).subscribe(response =>{
              if(this.testFinished == false){
                if(response !== undefined){
                  console.log("Timer response: ", response);
                  this.finalTestTimeInSeconds = response[this.testId]
                }
                else {
                  this.finalTestTimeInSeconds =Math.floor(Date.now()/1000)+this.testTotalTime*60;
                  let data: { [k: string]: number } = {};
                  data[this.testId] = this.finalTestTimeInSeconds
                  console.log("Setting timer")
                  this.authService.setTestFinishTime(this.userId,data)
                }

                if(typeof(this.intervalId) === 'undefined'){
                  this.intervalId = setInterval(() =>{
                    console.log("interval running!")
                    this.totalTimeRemaining = this.totalTimeRemaining == 0 ? this.totalTimeRemaining : this.finalTestTimeInSeconds - Math.floor(Date.now()/1000)
                    this.hour = Math.floor(this.totalTimeRemaining/3600)
                    this.minutes = Math.floor((this.totalTimeRemaining % 3600)/60)
                    this.seconds = Math.floor((this.totalTimeRemaining % 3600)%60)
                    if(this.totalTimeRemaining <= 0){
                      console.log("Interval cleared")
                      clearInterval(this.intervalId)
                      this.intervalId = undefined
                      this.finishInterval()
                    }
                    else{
                    }
                  },1000);
                }

                this.questionStartTime = Math.floor(Date.now()/1000)
              }
              else{
                this.totalTimeRemaining = 0;
              }
            })
          })
        })
      })
    })
  }

  

  finishInterval(){
    this.authService.removeTestFinishTime(this.userId);
    this.testFinished= true;
    if(this.isResultSubmitted == false){
      this.testData.questions[this.counter].totalTimeSpent = this.testData.questions[this.counter].totalTimeSpent === 0 
                      ? Math.floor(Date.now()/1000) - this.questionStartTime : 
                      this.testData.questions[this.counter].totalTimeSpent + (Math.floor(Date.now()/1000) - this.questionStartTime);
      this.evaluateMarks(this.testData);
      console.log(this.testData)
    }
  }

  submitTest(): void{
    clearInterval(this.intervalId)
    this.intervalId = undefined
    this.totalTimeRemaining = 0;
    this.finishInterval();
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
    this.prepareReportData();
  }


  prepareReportData(){
    let testQuestions: Array<TestReportQuestion> = [];

    this.testData.questions.forEach(question =>{
        let testReportQuestion:TestReportQuestion = {
          "question": question?.question,
          "options": question?.options,
          "selectedOption": question?.selectedOption === undefined ? null : question?.selectedOption,
          "correctAnswer": question?.correctAnswer,
          "subjectTags": question?.subjectTags,
          "topicTags": question?.topicTags,
          "totalTimeSpent": question?.totalTimeSpent === undefined ? 0 : question?.totalTimeSpent,
          "answerExplanation": question.answerExplanation
        }
        testQuestions.push(testReportQuestion)
    })

    let tests: Tests = {
      "testId" : this.testId,
      "testQuestions" : testQuestions,
      "testTakenDate" : new Date(),
      "testName": this.testData.testName,
      "testTakenBy": this.testData.testTakenBy,
      'testType': this.testData.testType
    }

    this.testToShowInTable = tests;

    let allTests : Array<any> = [];
    allTests.push(tests)

    let testReportDataToSend : TestReportData ={
      "allTests": allTests
    }
    this.testReportDataToSend = testReportDataToSend

    this.authService.createAllMockTestsGivenByAUser(this.userId, testReportDataToSend, this.isYourFirstTest).subscribe(response =>{
      this.isResultSubmitted = true;
    });
  }

  ngOnDestroy(){
    clearInterval(this.intervalId)
    this.subscription.unsubscribe()
  }

  increaseCounter(): void{
    this.testData.questions[this.counter].totalTimeSpent = this.testData.questions[this.counter].totalTimeSpent === 0 
                      ? Math.floor(Date.now()/1000) - this.questionStartTime : 
                      this.testData.questions[this.counter].totalTimeSpent + (Math.floor(Date.now()/1000) - this.questionStartTime);
    this.counter++;
    this.questionStartTime = Math.floor(Date.now()/1000)
  }

  decreaseCounter(): void{
    this.testData.questions[this.counter].totalTimeSpent = this.testData.questions[this.counter].totalTimeSpent === 0 
                      ? Math.floor(Date.now()/1000) - this.questionStartTime : 
                      this.testData.questions[this.counter].totalTimeSpent + (Math.floor(Date.now()/1000) - this.questionStartTime);
    this.counter --;
    this.questionStartTime = Math.floor(Date.now()/1000)
  }

  changeQuestion(questionIndex: number): void{
    this.testData.questions[this.counter].totalTimeSpent = this.testData.questions[this.counter].totalTimeSpent === 0 
                      ? Math.floor(Date.now()/1000) - this.questionStartTime : 
                      this.testData.questions[this.counter].totalTimeSpent + (Math.floor(Date.now()/1000) - this.questionStartTime);
    this.counter = questionIndex
    this.questionStartTime = Math.floor(Date.now()/1000)
  }

  optionSelected(questionNumber:number, selectedOption:number): void{
    console.log("Question : " + questionNumber + " Option Selected: " + selectedOption)
    this.testData.questions[this.counter].selectedOption = selectedOption;
    this.testData.questions[this.counter].answered = true;
    console.log(this.testData.questions[this.counter]);
    console.log(this.testData.questions)
  }

  viewDetailReport(){
    this.viewResult = true;
    this.sharedService.displayedColumns = this.displayedColumns
    this.sharedService.testData = this.testToShowInTable
    this.router.navigate(['/studentProfile/detailTestReport'])
  }

  viewProfile(){
    this.router.navigate(['/studentProfile/viewMyTests'])
  }


}
