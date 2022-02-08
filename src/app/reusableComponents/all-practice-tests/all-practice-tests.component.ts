import { AfterContentInit, AfterViewInit, Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TestsubscriptionService } from 'src/app/service/testsubscription.service';
import { MockTest } from '../../interface/mockTest';
import { TestSubscription } from 'src/app/interface/test-subscription';
import { AuthService } from 'src/app/service/auth.service';

@Component({
  selector: 'app-all-practice-tests',
  templateUrl: './all-practice-tests.component.html',
  styleUrls: ['./all-practice-tests.component.css']
})
export class AllPracticeTestsComponent implements OnInit {

  @Input() listOfMockTests: MockTest[] =[];
  @Input() initialListOfMockTests: MockTest[] =[];

  searchText!: string;
  @Input() userId!: string | undefined;
  @Input() isFirstSubscription!: boolean;
  @Input() loading = true;

  constructor(
    private authService: AuthService,
    private router : Router,
    private testsubscriptionService: TestsubscriptionService
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
  }

  search(event: any){
    console.log("Search text: ", event.length)
    if(event.length == 0){
      this.listOfMockTests = this.initialListOfMockTests
    }
    else{
      this.listOfMockTests = this.initialListOfMockTests.filter(test => test.testType?.toLowerCase().indexOf((<String>event).toLowerCase())!==-1 )
    }
  }

}
