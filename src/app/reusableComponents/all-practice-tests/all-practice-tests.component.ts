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

  searchText!: string;
  @Input() userId!: string | undefined;
  @Input() isFirstSubscription!: boolean;
  isFirstStudent: boolean = true;
  @Input() loading = true;

  constructor(
    private authService: AuthService,
    private router : Router,
    private testsubscriptionService: TestsubscriptionService,
    private sharedService: SharedService
  ) { }

  ngOnInit(): void {
  }

  startTest(testId: string | undefined, test: MockTest) : void{
    this.router.navigate(["/practicetest/testInstructions"], {queryParams: {data: testId, testTime: test.totalTime}})
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
      this.listOfMockTests = this.initialListOfMockTests.filter(test => test.testType?.toLowerCase().indexOf((<String>event).toLowerCase())!==-1 )
    }

    this.listOfMockTests = this.sharedService.sortData(this.listOfMockTests)

    // this.listOfMockTests.sort((x,y) =>{

    //   if(x.testType === 'Free' && y.testType === 'Free'){
    //     return 0
    //   }
    //   if(x.testType === 'Paid' && y.testType === 'Paid'){
    //     return x.isBought === y.isBought ? 0 : x.isBought ? -1 : 1
    //   }
    //   return x.testType ==='Free' ? -1 : 1
    // })
  }

}
