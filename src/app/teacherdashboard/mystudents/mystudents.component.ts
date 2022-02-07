import { Component, OnInit } from '@angular/core';
import { Timestamp } from 'firebase/firestore';
import { MockTest } from 'src/app/interface/mockTest';
import { AuthService } from 'src/app/service/auth.service';
import { ProfileService } from 'src/app/service/profile.service';
import { User } from '../../interface/user'

@Component({
  selector: 'app-mystudents',
  templateUrl: './mystudents.component.html',
  styleUrls: ['./mystudents.component.css']
})
export class MystudentsComponent implements OnInit {

  constructor(
    private authService: AuthService,
    private profileService: ProfileService
  ) { }

  loading: boolean = false;

  userId!: string | undefined;
  allTestsCreatedByATeacher: Array<string | undefined> =[];

  myStudents: User[] =[];

  ngOnInit(): void {
    this.loading = true;
    let sub = this.authService.getCurrentUser().subscribe(response =>{
      if(response !== null){
        this.userId = response.uid;
        sub.unsubscribe();
        this.authService.fetchAllMockTestsCreatedByATeacher(this.userId).subscribe((response:MockTest[]) =>{
          console.log("Teacher all tests: ", response)
          response.forEach(test =>{
            if(this.allTestsCreatedByATeacher.findIndex(ele => ele === test.id) ===-1){
              this.allTestsCreatedByATeacher.push(test.id)
            } 
            console.log("Teacher all tests id: ", this.allTestsCreatedByATeacher)
          })

          if(this.allTestsCreatedByATeacher.length !== 0){
            this.authService.fetchAllUserDetailsSubscribedToTeacherTests(this.allTestsCreatedByATeacher).subscribe(response =>{
              response.forEach((user:any) =>{
                this.profileService.getUserDetails(user['id']).subscribe(response =>{
                  if(this.myStudents.findIndex(ele => ele.email === response.email) === -1){
                    if(response.dob !== undefined){
                      response.dob = (<Timestamp><unknown>response.dob).toDate()
                    }
                    this.myStudents.push(response)
                  }
                })
                //this.myStudents.push(user['id'])
              })
              console.log("My students id list ", this.myStudents)
              console.log("My students details: ", response)
              this.loading = false;
            })
          }
          else{
            this.loading = false
          }
        })
      }
    })
  }

}
