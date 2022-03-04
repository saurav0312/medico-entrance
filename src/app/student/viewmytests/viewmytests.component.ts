import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { TestReportData } from '../../interface/testReportData';
import { Tests } from '../../interface/tests';
import { AuthService } from '../../service/auth.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { NavigationExtras, Router } from '@angular/router';
import { TestReportQuestion } from '../../interface/testReportQuestion';
import { SharedService } from 'src/app/service/shared.service';
import { MatSort } from '@angular/material/sort';

@Component({
  selector: 'app-viewmytests',
  templateUrl: './viewmytests.component.html',
  styleUrls: ['./viewmytests.component.css']
})
export class ViewmytestsComponent implements OnInit {

  testReportData! : TestReportData;
  testToShowInTable! : Tests;
  viewTest : boolean = false;

  displayedColumnsForAllTests: string[] = ['no', 'testId', 'testName', 'testTakenBy', 'testType' ,'testTakenDate'];

  displayedColumnsForIndividualTest: string[] = ['no','subjectTags','topicTags', 'result', 'timeSpent', 'timesViewed' ];

  dataSource: MatTableDataSource<Tests> = new MatTableDataSource();
  @ViewChild(MatPaginator) paginator! : MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private authService: AuthService,
    private sharedService: SharedService,
    private router : Router
  ) { }

  ngOnInit(): void {

    this.dataSource.filterPredicate = function(data, filter: string): boolean {
      return data.testName?.toLowerCase().includes(filter) || data.testTakenBy?.toLowerCase().includes(filter) || data.testType?.toLowerCase().includes(filter);
    };

    let sub = this.authService.getCurrentUser().subscribe(response =>{
      this.authService.getAllMockTestsGivenByAUser(response?.uid).subscribe(response =>{
        sub.unsubscribe()
        if(response!== undefined){
          this.testReportData = response
          this.dataSource.data = this.testReportData.allTests
        }
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort
      })
    })
  }

  viewIndividualTestReport(test: Tests): void{

    let params:any ={};
    params['displayedColumns'] = this.displayedColumnsForIndividualTest
    params['testData'] = test;

    // this.sharedService.displayedColumns = this.displayedColumnsForIndividualTest
    // this.sharedService.testData = test
    this.router.navigate(
      ['/studentProfile/detailTestReport'],
      {
        queryParams: 
          {
            
            
          }, 
          queryParamsHandling:'merge'
      }
    )
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

}
