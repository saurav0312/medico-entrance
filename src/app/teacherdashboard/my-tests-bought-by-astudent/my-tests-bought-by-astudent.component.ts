import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MockTest } from 'src/app/interface/mockTest';
import { TestSubscription } from 'src/app/interface/test-subscription';
import { AuthService } from 'src/app/service/auth.service';
import { TestsubscriptionService } from 'src/app/service/testsubscription.service';

@Component({
  selector: 'app-my-tests-bought-by-astudent',
  templateUrl: './my-tests-bought-by-astudent.component.html',
  styleUrls: ['./my-tests-bought-by-astudent.component.css']
})
export class MyTestsBoughtByAStudentComponent implements OnInit {

  loading: boolean = false;
  myStudentId!: string;
  teacherUserId!: string;
  studentsTestList: Array<string | undefined> =[];
  myAllTestsByTheStudent: Array<MockTest> = [];

  constructor(
    private authService: AuthService,
    private route: ActivatedRoute,
    private testSubscriptionService: TestsubscriptionService
  ) { }

  ngOnInit(): void {
    this.loading = true;

    this.route.queryParams.subscribe((params: any) =>{
      this.myStudentId = <string> params.myStudentId
      this.teacherUserId = <string> params.teacherUserId
      this.testSubscriptionService.getAllSubscribedTestsByAUser(this.myStudentId).subscribe((response: TestSubscription) =>{
        if(response !== undefined){
          this.studentsTestList = response.allSubscribedTests;
          this.authService.fetchAllMockTestsCreatedByATeacher(this.teacherUserId).subscribe((response:MockTest[]) =>{
            if(response !== null && response !== undefined){
              response.forEach(test =>{
                //common test id found -> insert that test into all tests bought list 
                if(this.studentsTestList.findIndex(ele => ele == test.id ) !== -1 && this.myAllTestsByTheStudent.findIndex(ele => ele.id == test.id ) === -1){
                  this.myAllTestsByTheStudent.push(test)
                }
              })
            }
            this.myAllTestsByTheStudent.sort((a,b) =>{
              if(a.testCategory === b.testCategory){
                return 0
              }
              else if(a.testCategory > b.testCategory){
                return 1
              }
              else{
                return -1
              }
            })
            this.loading = false
          })
        }
      })
    })
  }

}
