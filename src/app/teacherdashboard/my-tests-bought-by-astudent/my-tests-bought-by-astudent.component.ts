import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute } from '@angular/router';
import { MockTest } from 'src/app/interface/mockTest';
import { TestSubscription } from 'src/app/interface/test-subscription';
import { AuthService } from 'src/app/service/auth.service';

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

  dataSource: MatTableDataSource<MockTest> = new MatTableDataSource();
  //@ViewChild(MatPaginator) paginator! : MatPaginator;

  constructor(
    private authService: AuthService,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.loading = true;

    this.route.queryParams.subscribe((params: any) =>{
      this.myStudentId = <string> params.myStudentId
      this.teacherUserId = <string> params.teacherUserId
      this.authService.fetchAllTestsBoughtByThisStudent(this.myStudentId).subscribe((response: TestSubscription) =>{
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
            this.dataSource.data = this.myAllTestsByTheStudent ;
            //this.dataSource.paginator = this.paginator
            this.loading = false
          })
        }
      })
    })
  }

}
