import { Component, OnInit } from '@angular/core';
import { Userr } from 'src/app/interface/user';
import * as XLSX from 'xlsx';
import { MockTest } from '../../interface/mockTest';
import { AuthService } from '../../service/auth.service';
import { User } from 'firebase/auth';
import { TeacherSubscription } from 'src/app/interface/teacher-subscription';
import { TeacherSubscriptionService } from 'src/app/service/teacher-subscription.service';
import { Timestamp } from 'firebase/firestore';
import { SubjectList } from 'src/app/interface/subject-list';

@Component({
  selector: 'app-studentdashboardcontent',
  templateUrl: './studentdashboardcontent.component.html',
  styleUrls: ['./studentdashboardcontent.component.scss']
})
export class StudentdashboardcontentComponent implements OnInit {

  mockTest! : MockTest;
  mockTests! : MockTest[];

  tempListOfTeachers: Userr[] = [];
  listOfTeachers: Userr[] = [];
  initialListOfTeachers: Userr[] = [];
  allSubscribedTeachers: Array<string | undefined> = [];
  isFirstSubscription: boolean = true;

  loading = false;
  currentUserId!: string;

  category: string ='All';
  searchText: string ='';

  categoryList: string[] =["All","Subscribed","Unsubscribed"];
  categoryListTemp: SubjectList[] = [
    {
      name: 'All'
    },
    {
      name: 'Subscribed'
    },
    {
      name: 'Unsubscribed'
    }
  ];

  categoryItemTemp: SubjectList = this.categoryListTemp[0];

  username: string | null = '';

  constructor(
    private authService: AuthService,
    private teacherSubscriptionService: TeacherSubscriptionService
    ) { }

  ngOnInit(): void {
    this.loading = true;
    this.authService.getCurrentUser().subscribe((response:User) =>{
      if(response !== null){
        this.currentUserId = response.uid
        this.username = response.displayName
        this.authService.getUserDetailsByType("teacher").subscribe((response:any) =>{
          if(response !== null){
            this.listOfTeachers = response
            this.listOfTeachers.forEach(teacher =>{
              if(teacher.dob !== undefined){
                teacher.dob = (<Timestamp><unknown>(teacher.dob)).toDate()
              }
            })
            
            this.teacherSubscriptionService.getAllSubscribedTeachersByAUser(this.currentUserId).subscribe((response:TeacherSubscription) =>{
              if(response !== undefined && response !== null){
                this.allSubscribedTeachers = response.allTeacherSubscribed
                this.isFirstSubscription = false;
              }

              if(this.listOfTeachers.length > 0 && this.allSubscribedTeachers.length == 0){
                this.listOfTeachers.forEach(teacher =>{
                  teacher.isSubscribed = false;
                })
              }

              if(this.listOfTeachers.length > 0 && this.allSubscribedTeachers.length > 0){
                this.listOfTeachers.forEach(teacher =>{
                  if(this.allSubscribedTeachers.findIndex(subscribedTeacher => subscribedTeacher === teacher.id) !== -1){
                    teacher.isSubscribed = true;
                  }
                  else{
                    teacher.isSubscribed = false;
                  }
                })
              }
              this.initialListOfTeachers = []
              this.listOfTeachers.forEach(teacher =>{
                this.initialListOfTeachers.push(teacher)
              });

              this.listOfTeachers.sort((x,y) =>{
                return x.isSubscribed === y.isSubscribed ? 0 : x.isSubscribed ? -1 : 1
              })
              // let categoryMap = {
              //   "value":category
              // }
              // this.categorySelected(categoryMap)
            })
          }
        })
        this.loading = false
      }
    })
  }

  subscribeToTeacher(teacher: Userr){

    if(teacher.isSubscribed){
      this.teacherSubscriptionService.deleteEntryFromStudentTeacherSubscriptionCollection(this.currentUserId,teacher.id).subscribe(response =>{
        teacher.isSubscribed = false;
        this.category = 'All';
        this.ngOnInit()
      })
    }
    else{
      const data: TeacherSubscription ={
        allTeacherSubscribed: [teacher.id]
      }
      this.searchText =''
      this.teacherSubscriptionService.subscribeToTeacher(this.currentUserId, teacher.id).subscribe(response =>{
        this.category = 'All'
        this.ngOnInit()
      });
    }
  }

  categorySelected(category: any){
    this.listOfTeachers = []
    
    if(category['value'] == 'All' || category['value'] === undefined){
      this.initialListOfTeachers.forEach(teacher =>{
        this.listOfTeachers.push(teacher)
      })
    }
    else if(category['value'] =='Subscribed'){
      this.listOfTeachers = this.initialListOfTeachers.filter(teacher => teacher.isSubscribed == true)
    }
    else{
      this.listOfTeachers = this.initialListOfTeachers.filter(teacher => teacher.isSubscribed == false)
    }
    this.listOfTeachers.sort((x,y) =>{
      return x.isSubscribed === y.isSubscribed ? 0 : x.isSubscribed ? -1 : 1
    })

    if(this.searchText!==''){
      let event ={
        'target':{
          'value': this.searchText
        }
      }
      this.searchByName(event)
    }
  }

  categorySelectedTemp(event: any){
  }

  searchByName(event:any){
    let filterValue = (event.target as HTMLInputElement).value;
    filterValue = filterValue.trim().toLowerCase()
    
    if(filterValue ==''){
      let data = {
        'value': this.category
      }
      this.categorySelected(data)
      //this.listOfTeachers = this.initialListOfTeachers
    }
    else{
      this.listOfTeachers = this.initialListOfTeachers.filter(teacher => teacher.firstName.toLowerCase().includes(filterValue) || teacher.lastName.toLowerCase().includes(filterValue))
    }
  }
}
