import { Component, Input, OnInit } from '@angular/core';
import { MockTest } from '../../interface/mockTest';
import { AuthService } from '../../service/auth.service';
import { ActivatedRoute, Router } from '@angular/router';
import { TestsubscriptionService } from 'src/app/service/testsubscription.service';
import { TestSubscription } from 'src/app/interface/test-subscription';
import { SharedService } from 'src/app/service/shared.service';

@Component({
  selector: 'app-practicetests',
  templateUrl: './practicetests.component.html',
  styleUrls: ['./practicetests.component.css']
})
export class PracticetestsComponent implements OnInit {

  searchText!: string;

  //mockTests! : MockTest[];
  testIdList: Array<string>=[];
  noOfTests!: number;
  userId!: string | undefined;

  loading: boolean = false;
  isFirstSubscription: boolean = true;
  allSubscribedTests: Array<string | undefined> =[];

  @Input() listOfMockTests : MockTest[] = [];
  initialListOfMockTests: MockTest[] =[];

  testCategory!: string;

  constructor(
    private authService: AuthService,
    private router : Router,
    private testsubscriptionService: TestsubscriptionService,
    private sharedService: SharedService,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.loading = true;
      const sub = this.authService.getCurrentUser().subscribe(response =>{
        if(response !== null){
          this.userId = response.uid
          this.testsubscriptionService.getAllSubscribedTestsByAUser(this.userId).subscribe((response:TestSubscription) =>{
            if(response !== undefined){
              this.allSubscribedTests = response.allSubscribedTests
              this.isFirstSubscription = false;
            }
            this.route.queryParams.subscribe((params: any) =>{
              this.testCategory = <string>params.testCategory
              this.authService.readMockTest(this.testCategory).subscribe((response: MockTest[]) =>{
                this.loading = false;
                this.listOfMockTests = response
                if(this.listOfMockTests.length > 0 && this.allSubscribedTests.length > 0){
                  this.listOfMockTests.forEach(test =>{
                    if(this.allSubscribedTests.findIndex(subscribedTest => subscribedTest === test.id) !== -1){
                      test.isBought = true;
                    }
                  })
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
                this.initialListOfMockTests = this.listOfMockTests
              })
            })
          })
          sub.unsubscribe()
        }
      })

    

  //   this.authService.readMockTest().subscribe((response: any) =>{
  //     this.mockTests = response
  //     //this.collec = JSON.stringify(this.mockTests)
  //     console.log("Collection of MockTests: ", response)
  // })
  }

  // startTest(testId: string | undefined, test: MockTest) : void{
  //   this.router.navigate(["/practicetest/testInstructions"], {queryParams: {data: testId, testTime: test.totalTime}})
  // }

  // buyTest(testId: string | undefined) : void{
  //   const data: TestSubscription ={
  //     allSubscribedTests: [testId]
  //   }
  //   this.testsubscriptionService.subscribeToTest(this.userId, data, this.isFirstSubscription);
  // }

  // search(event: any){
  //   console.log("Search text: ", event.length)
  //   if(event.length == 0){
  //     this.listOfMockTests = this.initialListOfMockTests
  //   }
  //   else{
  //     this.listOfMockTests = this.initialListOfMockTests.filter(test => test.testType?.toLowerCase().indexOf((<String>event).toLowerCase())!==-1 )
  //   }
  // }

}
