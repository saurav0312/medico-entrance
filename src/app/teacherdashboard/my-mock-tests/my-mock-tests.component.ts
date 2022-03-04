import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MockTest } from 'src/app/interface/mockTest';
import { AuthService } from 'src/app/service/auth.service';

@Component({
  selector: 'app-my-mock-tests',
  templateUrl: './my-mock-tests.component.html',
  styleUrls: ['./my-mock-tests.component.css']
})
export class MyMockTestsComponent implements OnInit {

  loading: boolean = false;

  allTestByTheTeacher: Array<MockTest> = [];
  dataSource: MatTableDataSource<MockTest> = new MatTableDataSource();
  //@ViewChild(MatPaginator) paginator! : MatPaginator;

  constructor(
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    this.loading = true;
    let sub = this.authService.getCurrentUser().subscribe(response =>{
      if(response !== null){
        this.authService.fetchAllMockTestsCreatedByATeacher(response.uid).subscribe((response:MockTest[]) =>{
          if(response !== null){
            this.allTestByTheTeacher = response
            this.dataSource.data = this.allTestByTheTeacher ;
            //this.dataSource.paginator = this.paginator
            this.loading = false;
          }
          else{
            this.loading = false;
          }
        })
      }
      else{
        this.loading = false;
      }
      sub.unsubscribe()
    })
  }

}
