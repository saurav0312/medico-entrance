import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { TestReportData } from '../../interface/testReportData';
import { Tests } from '../../interface/tests';
import { AuthService } from '../../service/auth.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { NavigationExtras, Router } from '@angular/router';
import { TestReportQuestion } from '../../interface/testReportQuestion';
import { SharedService } from 'src/app/service/shared.service';

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

  displayedColumnsForIndividualTest: string[] = ['no', 'question','selectedOption', 'correctAnswer', 'result'];

  dataSource: MatTableDataSource<Tests> = new MatTableDataSource();
  @ViewChild(MatPaginator) paginator! : MatPaginator;

  constructor(
    private authService: AuthService,
    private sharedService: SharedService,
    private router : Router
  ) { }

  ngOnInit(): void {
    this.authService.currentUser$.subscribe(response =>{
      this.authService.getAllMockTestsGivenByAUser(response?.uid).subscribe(response =>{

        if(response!== undefined){
          this.testReportData = response
          this.dataSource.data = this.testReportData.allTests
        }
        this.dataSource.paginator = this.paginator;
      })
    })
  }

  viewIndividualTestReport(test: Tests): void{

    this.sharedService.displayedColumns = this.displayedColumnsForIndividualTest
    this.sharedService.testData = test
    console.log("Cell clicked: ", this.testToShowInTable)
    this.router.navigate(['/detailTestReport'])
  }

}
