import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Route } from '@angular/router';
import { MockTest } from 'src/app/interface/mockTest';
import { TestSubscription } from 'src/app/interface/test-subscription';
import { AuthService } from 'src/app/service/auth.service';
import { TestsubscriptionService } from 'src/app/service/testsubscription.service';

@Component({
  selector: 'app-all-tests-by-ateacher',
  templateUrl: './all-tests-by-ateacher.component.html',
  styleUrls: ['./all-tests-by-ateacher.component.css']
})
export class AllTestsByATeacherComponent implements OnInit {

  teacherId!: string;
  listOfMockTests! : MockTest[];
  loading: boolean = false;
  userId!: string;
  isFirstSubscription: boolean = true;
  initialListOfMockTests!: MockTest[];
  allSubscribedTests: Array<string | undefined> =[];

  constructor(
    private route: ActivatedRoute,
    private authService: AuthService,
    private testsubscriptionService : TestsubscriptionService
  ) { }

  ngOnInit(): void {
    this.loading = true;
    this.authService.getCurrentUser().subscribe(response =>{
      if(response !== null){
        this.userId = response.uid
        this.testsubscriptionService.getAllSubscribedTestsByAUser(this.userId).subscribe((response:TestSubscription) =>{
          if(response !== undefined){
            this.allSubscribedTests = response.allSubscribedTests
            console.log("Subscribed Tests:", response)
            this.isFirstSubscription = false;
          }

          this.route.queryParams.subscribe((params: any) =>{
            this.teacherId = <string>params.teacherId
            this.authService.fetchAllMockTestsCreatedByATeacher(this.teacherId).subscribe(response =>{
              console.log("ALl test by the teacherr: ", response)
              this.listOfMockTests = response
              this.initialListOfMockTests = response
              if(this.listOfMockTests.length > 0 && this.allSubscribedTests.length > 0){
                this.listOfMockTests.forEach(test =>{
                  if(this.allSubscribedTests.findIndex(subscribedTest => subscribedTest === test.id) !== -1){
                    test.isBought = true;
                  }
                })
              }
              this.loading = false
            })
          })
        })
      }
    })
  }
}
