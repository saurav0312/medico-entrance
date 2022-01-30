import { Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MockTest } from '../interface/mockTest';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../service/auth.service';
import { HttpClient } from '@angular/common/http';
import { TestReportData } from '../interface/testReportData';
import { TestReportQuestion } from '../interface/testReportQuestion';
import { Tests } from '../interface/tests';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';

@Component({
  selector: 'app-starttest',
  templateUrl: './starttest.component.html',
  styleUrls: ['./starttest.component.css']
})
export class StarttestComponent implements OnInit, OnDestroy {
  displayedColumns: string[] = ['question', 'selectedOption', 'correctAnswer', 'result'];
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
  totalTimeRemaining = 10;
  testFinished : boolean = false;
  noOfQuestionsAnsweredCorrectly! : number;
  noOfQuestionsAnsweredIncorrectly! : number;
  noOfQuestionsAttempted! : number;
  noOfQuestionsUnattempted! : number;
  intervalId!: any;
  userId!: string | undefined;
  realtimeDatabaseUrl! : string;  

  constructor(
    private router : Router,
    private route: ActivatedRoute,
    private authService: AuthService,
    private httpClient : HttpClient
  ) { }

  ngOnInit(): void {

    this.cols = [
      { field: 'question', header: 'Question' },
      { field: 'selectedOption', header: 'Selected Option' },
      { field: 'correctAnswer', header: 'Correct Answer' }
  ];

  this.dataSource = new MatTableDataSource();
  // this.dataSource.paginator = this.paginator;

    this.route.queryParams.subscribe((params: any) =>{
      this.testId = <string>params.data
      this.authService.getMockTestByID(this.testId).subscribe(response=>{
        this.testData= response;
        this.authService.currentUser$.subscribe(response =>{
          this.userId = response?.uid
          this.realtimeDatabaseUrl = this.authService.realtimeDatabaseUrl;
          this.authService.getAllMockTestsGivenByAUser(this.userId).subscribe(response =>{
            if(response !== undefined){
              this.isYourFirstTest = false;
            }
            //this.testReportDataToSend = response
            //console.log("User MockTests Result" ,this.testReportDataToSend)
          })
        })
         
        // this.intervalId = setInterval(() =>{
        //   console.log("interval running!")
        //   if(this.totalTimeRemaining === 0){
        //     this.finishInterval()
        //   }
        //   else{
        //     this.totalTimeRemaining--;
        //   }
        // },1000);
      })
    })
  }

  finishInterval(){
    clearInterval(this.intervalId)
    this.testFinished= true;
    this.evaluateMarks(this.testData);
    console.log(this.testData)
  }

  submitTest(): void{
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
    // this.httpClient.post(this.realtimeDatabaseUrl +"users.json", {"name": this.testId}).subscribe(res =>{
    //   console.log("Results sent")
    // });

    //this.authService.createAllMockTestsGivenByAUser("sa", {});
    this.prepareReportData();
  }


  prepareReportData(){
    let testQuestions: Array<TestReportQuestion> = [];

    this.testData.questions.forEach(question =>{
      if(question.selectedOption!== undefined){
        let testReportQuestion:TestReportQuestion = {
          "question": question?.question,
          "selectedOption": question?.selectedOption,
          "correctAnswer": question?.correctAnswer
        }
        testQuestions.push(testReportQuestion)
      }
      else{
        let testReportQuestion:TestReportQuestion = {
          "question": question?.question,
          "selectedOption": null,
          "correctAnswer": question?.correctAnswer
        }
        testQuestions.push(testReportQuestion)
      }
    })

    let tests: Tests = {
      "testId" : this.testId,
      "testQuestions" : testQuestions,
      "testTakenDate" : new Date()
    }

    this.testToShowInTable = tests;

    let allTests : Array<any> = [];
    allTests.push(tests)

    let testReportDataToSend : TestReportData ={
      "allTests": allTests
    }
    this.testReportDataToSend = testReportDataToSend

    this.authService.createAllMockTestsGivenByAUser(this.userId, testReportDataToSend, this.isYourFirstTest);
  }

  ngOnDestroy(){
    clearInterval(this.intervalId)
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

  viewDetailReport(){
    this.viewResult = true;
    //this.dataSource = new MatTableDataSource<TestReportQuestion>(this.testToShowInTable.testQuestions)
    this.dataSource.data = this.testToShowInTable.testQuestions;
    this.dataSource.paginator = this.paginator;
    // this.testReportDataToSend.allTests.forEach(test =>{
    //   this.testQuestions = test.testQuestions
    // })
    // this.authService.getAllMockTestsGivenByAUser(this.userId).subscribe(response =>{
    //   this.testReportDataToSend = response
    //   console.log("User MockTests Result" ,this.testReportDataToSend)
    // })
  }

}
