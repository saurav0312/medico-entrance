import { AfterContentInit, AfterViewInit, Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TestsubscriptionService } from 'src/app/service/testsubscription.service';
import { MockTest } from '../../interface/mockTest';
import { TestSubscription } from 'src/app/interface/test-subscription';
import { AuthService } from 'src/app/service/auth.service';
import { SharedService } from 'src/app/service/shared.service';
import { StudentsOfTest } from 'src/app/interface/students-of-test';

@Component({
  selector: 'app-all-practice-tests',
  templateUrl: './all-practice-tests.component.html',
  styleUrls: ['./all-practice-tests.component.scss']
})
export class AllPracticeTestsComponent implements OnInit {

  @Input() listOfMockTests: MockTest[] =[];
  @Input() initialListOfMockTests: MockTest[] =[];

  searchText: string ='';
  @Input() userId!: string | undefined;
  @Input() isFirstSubscription!: boolean;
  isFirstStudent: boolean = true;
  @Input() loading = true;
  @Input() testCategory = '';

  constructor(
    private authService: AuthService,
    private router : Router,
    private testsubscriptionService: TestsubscriptionService,
    private sharedService: SharedService
  ) { }

  ngOnInit(): void {
  }

  startTest(testId: string | undefined, test: MockTest) : void{
    this.router.navigate(["/practicetest/testInstructions"], {queryParams: {data: testId, testTime: test.totalTime, testCategory:  this.testCategory}})
  }

  buyTest(testId: string | undefined) : void{
    const data: TestSubscription ={
      allSubscribedTests: [testId]
    }
    this.searchText =''
    this.testsubscriptionService.subscribeToTest(this.userId, data, this.isFirstSubscription);

    const studentData : StudentsOfTest ={
      allStudentsOfTheTest : [this.userId]
    }

    const sub = this.testsubscriptionService.getAllStudentsOfATest(testId).subscribe(response =>{
      if(response !== undefined){
        this.isFirstStudent = false;
      }
      else{
        this.isFirstStudent = true;
      }
      sub.unsubscribe()
      this.testsubscriptionService.addStudentToATest(testId, studentData, this.isFirstStudent)
    })
  }

  search(event: any){
    console.log("Search text: ", event.length)
    if(event.length == 0){
      this.listOfMockTests = this.initialListOfMockTests
    }
    else{

      //filter by test name
      this.listOfMockTests = this.initialListOfMockTests.filter(test => test.testName?.toLowerCase().indexOf((<string>event).toLowerCase())!==-1 )
      let tempListOfMockTestsByTestType: MockTest[] =[];

      //filter by test type
      tempListOfMockTestsByTestType = this.initialListOfMockTests.filter(test => test.testType?.toLowerCase().indexOf((<String>event).toLowerCase())!==-1 )
      
      let uniqueTests: MockTest[] = [];
      tempListOfMockTestsByTestType.forEach(test =>{
        if(this.listOfMockTests.findIndex(ele => ele.id === test.id) ===-1){
          uniqueTests.push(test)
        }
      })

      this.listOfMockTests = this.listOfMockTests.concat(uniqueTests)


      //filter by test taken by
      let tempListOfMockTestsByTestTakenBy: MockTest[] =[];
      tempListOfMockTestsByTestTakenBy = this.initialListOfMockTests.filter(test => test.testTakenBy?.toLowerCase().indexOf((<String>event).toLowerCase())!==-1 )

      uniqueTests = [];
      tempListOfMockTestsByTestTakenBy.forEach(test =>{
        if(this.listOfMockTests.findIndex(ele => ele.id === test.id) ===-1){
          uniqueTests.push(test)
        }
      })

      this.listOfMockTests = this.listOfMockTests.concat(uniqueTests)
      
    }

    this.listOfMockTests = this.sharedService.sortData(this.listOfMockTests)
  }

}
