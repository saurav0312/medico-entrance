import { Component, Input, OnInit } from '@angular/core';
import { User } from '../../interface/user';
import { MockTest } from '../../interface/mockTest';
import { Question } from '../../interface/question';
import { Firestore, collectionData, collection } from '@angular/fire/firestore';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../../service/auth.service';
import { ActivatedRoute, Router } from '@angular/router';
import { TestsubscriptionService } from 'src/app/service/testsubscription.service';
import { TestSubscription } from 'src/app/interface/test-subscription';

@Component({
  selector: 'app-practicetests',
  templateUrl: './practicetests.component.html',
  styleUrls: ['./practicetests.component.css']
})
export class PracticetestsComponent implements OnInit {

  //mockTests! : MockTest[];
  testIdList: Array<string>=[];
  noOfTests!: number;
  userId!: string | undefined;

  testType!: string;
  isBought: boolean = false;
  loading: boolean = false;
  isFirstSubscription: boolean = true;
  allSubscribedTests: Array<string | undefined> =[];

  @Input() listOfMockTests : MockTest[] = [];

  constructor(
    private authService: AuthService,
    private router : Router,
    private route: ActivatedRoute,
    private testsubscriptionService: TestsubscriptionService
  ) { }

  ngOnInit(): void {
    this.loading = true;
    this.route.queryParams.subscribe((params: any)=>{
      this.testType = <string>params.testType;
      const sub = this.authService.getCurrentUser().subscribe(response =>{
        if(response !== null){
          this.userId = response.uid
          this.testsubscriptionService.getAllSubscribedTestsByAUser(this.userId).subscribe((response:TestSubscription) =>{
            if(response !== undefined){
              this.allSubscribedTests = response.allSubscribedTests
              console.log("Subscribed Tests:", response)
              this.isFirstSubscription = false;
            }
            this.authService.readMockTest(this.testType).subscribe((response: MockTest[]) =>{
              this.loading = false;
              this.listOfMockTests = response
              console.log("Collection of MockTests: ", response)
              if(this.listOfMockTests.length > 0 && this.allSubscribedTests.length > 0){
                this.listOfMockTests.forEach(test =>{
                  if(this.allSubscribedTests.findIndex(subscribedTest => subscribedTest === test.id) !== -1){
                    test.isBought = true;
                  }
                })
              }
            })
            //this.testReportDataToSend = response
            //console.log("User MockTests Result" ,this.testReportDataToSend)
          })
          sub.unsubscribe()
        }
      })
    })

    

  //   this.authService.readMockTest().subscribe((response: any) =>{
  //     this.mockTests = response
  //     //this.collec = JSON.stringify(this.mockTests)
  //     console.log("Collection of MockTests: ", response)
  // })
  }

  startTest(testId: string | undefined, test: MockTest) : void{
    this.router.navigate(["/practicetest/testInstructions"], {queryParams: {data: testId, testType: this.testType, testTime: test.totalTime}})
  }

  buyTest(testId: string | undefined) : void{
    const data: TestSubscription ={
      allSubscribedTests: [testId]
    }
    this.testsubscriptionService.subscribeToTest(this.userId, data, this.isFirstSubscription);
    this.isBought = true;
  }

}
