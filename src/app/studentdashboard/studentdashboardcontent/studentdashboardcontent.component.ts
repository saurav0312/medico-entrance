import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/interface/user';
import * as XLSX from 'xlsx';
import { MockTest } from '../../interface/mockTest';
import { Question } from '../../interface/question';
import { AuthService } from '../../service/auth.service';

@Component({
  selector: 'app-studentdashboardcontent',
  templateUrl: './studentdashboardcontent.component.html',
  styleUrls: ['./studentdashboardcontent.component.scss']
})
export class StudentdashboardcontentComponent implements OnInit {

  mockTest! : MockTest;
  mockTests! : MockTest[];

  listOfTeachers: User[] = [];

  loading = false;

  constructor(
    private authService: AuthService 
    ) { }

  ngOnInit(): void {
    this.loading = true;
    this.authService.getUserDetailsByType("teacher").subscribe((response:any) =>{
      this.listOfTeachers = response
      this.loading = false
      console.log("All teacher details: ", response)
    })
  }
}
