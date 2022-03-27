import { AfterViewInit, Component, HostListener, OnInit, ViewChild } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';
import { MessageService } from 'primeng/api';
import { BehaviorSubject } from 'rxjs';
import { Userr } from 'src/app/interface/user';
import { AuthService } from 'src/app/service/auth.service';

@Component({
  selector: 'app-admin-dashboard-home-content',
  templateUrl: './admin-dashboard-home-content.component.html',
  styleUrls: ['./admin-dashboard-home-content.component.css']
})
export class AdminDashboardHomeContentComponent implements OnInit {

  loading: boolean = false;

  allUsers: Userr[] = [];

  allStudents: Userr[] = [];
  allTeachers: Userr[] = [];

  studentDisplayedColumns = [
    { field: 'id', header: 'User Id' },
    { field: 'firstName', header: 'First Name' },
    { field: 'lastName', header: 'Last Name' },
    { field: 'email', header: 'Email' }
  ];

  teacherDisplayedColumns = [
    { field: 'id', header: 'User Id' },
    { field: 'firstName', header: 'First Name' },
    { field: 'lastName', header: 'Last Name' },
    { field: 'email', header: 'Email' },
    { field: 'teacherCode', header: 'Teacher Code'},
    { field: 'isVerified', header: 'Status'},
    { field: 'action', header: 'Action'}
  ];


  

  constructor(
    private authService: AuthService,
    private messageService: MessageService
  ) { }

  ngOnInit(): void {
    this.loading = true;
    
    this.authService.getAllUserDetails().subscribe(allUserDetails =>{
      this.loading = false;
      this.allUsers = allUserDetails
      this.allStudents = allUserDetails.filter((userr:Userr) => userr.accountType === 'student')
      this.allTeachers = allUserDetails.filter((userr:Userr) => userr.accountType === 'teacher')
      this.allTeachers.forEach(teacher =>{
        this.authService.getTeacherCodeInfo(teacher.teacherCode).subscribe(teacherCodeInfo =>{
          console.log("Teacher code info: ", teacherCodeInfo)
          teacher.isVerified = teacherCodeInfo.isVerified
        })
      })
      console.log("All users: ", allUserDetails)
      console.log("All users: ", this.allTeachers)
    },
    error =>{
      this.loading = false;
      this.messageService.add({severity:'error',summary:error.error})
    })
  }

  verifyDisableTeacher(teacherData: Userr, index: number){
    //already verified... so disable it
    if(teacherData.isVerified === true ){
      teacherData.isVerified = false;
    }
    else{
      teacherData.isVerified = true;
    }
    this.authService.updateTeacherCodeInfo(teacherData.teacherCode, teacherData.isVerified).subscribe(teacherCodeUpdated =>{
      console.log("Teacher code updated: ", teacherCodeUpdated)
    })
  }
}
