import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Timestamp } from 'firebase/firestore';
import { Userr } from 'src/app/interface/user';
import { UserToTestIdMapping } from 'src/app/interface/user-to-test-id-mapping';
import { AuthService } from 'src/app/service/auth.service';
import { ProfileService } from 'src/app/service/profile.service';

@Component({
  selector: 'app-view-all-students-of-atest',
  templateUrl: './view-all-students-of-atest.component.html',
  styleUrls: ['./view-all-students-of-atest.component.css']
})
export class ViewAllStudentsOfAtestComponent implements OnInit {

  testId!: string;
  myStudents: Userr[] =[];
  loading: boolean = false;
  testCategory!: string;

  constructor(
    private route: ActivatedRoute,
    private authService: AuthService,
    private profileService: ProfileService
  ) { }

  ngOnInit(): void {
    this.loading =true;
    this.route.queryParams.subscribe( (response:any) =>{
      this.testId = <string>response.testId
      this.testCategory = <string> response.testCategory
      this.viewAllStudents(this.testId)
    })
  }

  viewAllStudents(testId: string){
    this.authService.readStudentIdToTestIdMapping(testId).subscribe((allUserIdResponse:UserToTestIdMapping[]) =>{
      let uniqueUserIdList: string[] = [];
      allUserIdResponse.forEach((userResponse:UserToTestIdMapping) =>{
        if(uniqueUserIdList.length > 0){
          if(uniqueUserIdList.findIndex(userId => userId === userResponse.userId) === -1){
            uniqueUserIdList.push(userResponse.userId)
          }
        }
        else{
          uniqueUserIdList.push(userResponse.userId)
        }
      })

      if(uniqueUserIdList.length > 0){
        uniqueUserIdList.forEach((studentUserId:any) =>{
          this.profileService.getUserDetails(studentUserId).subscribe(response =>{
            if(this.myStudents.findIndex(ele => ele.email === response.email) === -1){
              if(response.dob !== undefined){
                response.dob = (<Timestamp><unknown>response.dob).toDate()
              }
              response.id = studentUserId
              this.myStudents.push(response)
            }
          },
          error =>{
            this.loading = false;
            window.alert(error.error)
          })
        })
        this.loading = false;
      }
      else{
        this.loading = false;
      }



      // if(uniqueUserIdList.length > 0){
      //   uniqueUserIdList.forEach(userId =>{
      //     this.authService.getAllHistoryOfAMockTestGivenByAUserForTeacherAnalysis(userId, testId).subscribe(allTestsResponse =>{
      //       console.log("All test given by user: ", allTestsResponse)
      //     })
      //   })
      // }
    })
  }

}
