import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { TestReportData } from '../../interface/testReportData';
import { Tests } from '../../interface/tests';
import { AuthService } from '../../service/auth.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { NavigationExtras, Router } from '@angular/router';
import { TestReportQuestion } from '../../interface/testReportQuestion';

@Component({
  selector: 'app-studentprofile',
  templateUrl: './studentprofile.component.html',
  styleUrls: ['./studentprofile.component.css']
})
export class StudentprofileComponent implements OnInit {

  // testReportData! : TestReportData;
  // testToShowInTable! : Tests;
  // viewTest : boolean = false;
  username!: string | undefined | null;

  dataSource: MatTableDataSource<Tests> = new MatTableDataSource();
  @ViewChild(MatPaginator) paginator! : MatPaginator;

  constructor(
    private authService: AuthService,
    private router : Router
  ) { }

  ngOnInit(): void {
    this.authService.currentUser$.subscribe(response =>{
      this.username = response?.displayName
    })
  }

  // viewIndividualTestReport(test: Tests): void{
  //   this.viewTest = true;
  //   this.testToShowInTable = test;
  //   console.log("Cell clicked: ", this.testToShowInTable)
  // }


}
