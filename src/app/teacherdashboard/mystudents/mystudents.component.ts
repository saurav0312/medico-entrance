import { Component, OnInit } from '@angular/core';
import { Timestamp } from 'firebase/firestore';
import { MockTest } from 'src/app/interface/mockTest';
import { StudentsOfTest } from 'src/app/interface/students-of-test';
import { AuthService } from 'src/app/service/auth.service';
import { ProfileService } from 'src/app/service/profile.service';
import { TestsubscriptionService } from 'src/app/service/testsubscription.service';
import { Userr } from '../../interface/user'

@Component({
  selector: 'app-mystudents',
  templateUrl: './mystudents.component.html',
  styleUrls: ['./mystudents.component.css']
})
export class MystudentsComponent implements OnInit {

  constructor(
    private authService: AuthService,
    private profileService: ProfileService,
    private testSubscriptionService: TestsubscriptionService
  ) { }

  loading: boolean = false;

  userId!: string | undefined;
  allTestsCreatedByATeacher: Array<string | undefined> =[];

  myStudents: Userr[] =[];

  ngOnInit(): void {
    this.loading = true;
    let sub = this.authService.getCurrentUser().subscribe(response =>{
      if(response !== null){
        this.userId = response.uid;
        sub.unsubscribe();
        this.authService.fetchAllMockTestsCreatedByATeacher(this.userId).subscribe((response:MockTest[]) =>{
          response.forEach(test =>{
            if(this.allTestsCreatedByATeacher.findIndex(ele => ele === test.id) ===-1){
              this.allTestsCreatedByATeacher.push(test.id)
            } 
          })

          if(this.allTestsCreatedByATeacher.length !== 0){
            this.allTestsCreatedByATeacher.forEach(testId =>{
              //const testIdList = this.allTestsCreatedByATeacher.splice(0,10);
              this.testSubscriptionService.getAllStudentsOfATest(testId).subscribe((studentsOfTest:StudentsOfTest) =>{
                if(studentsOfTest.allStudentsOfTheTest.length > 0){
                  studentsOfTest.allStudentsOfTheTest.forEach((studentUserId:any) =>{
                    this.profileService.getUserDetails(studentUserId).subscribe(response =>{
                      if(this.myStudents.findIndex(ele => ele.email === response.email) === -1){
                        if(response.dob !== undefined){
                          response.dob = (<Timestamp><unknown>response.dob).toDate()
                        }
                        response.id = studentUserId
                        this.myStudents.push(response)
                      }
                    })
                  })
                }
                
              })
            })
            setTimeout(() =>{
              this.loading = false;
            }, 500)
          }
          else{
            this.loading = false
          }
        })
      }
    })
  }

}
