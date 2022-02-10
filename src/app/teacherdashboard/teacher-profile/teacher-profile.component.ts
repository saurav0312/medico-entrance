import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { TestReportData } from '../../interface/testReportData';
import { Tests } from '../../interface/tests';
import { AuthService } from '../../service/auth.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { ToastrService } from 'ngx-toastr';
import { NavigationExtras, Router } from '@angular/router';
import { TestReportQuestion } from '../../interface/testReportQuestion';

@Component({
  selector: 'app-teacher-profile',
  templateUrl: './teacher-profile.component.html',
  styleUrls: ['./teacher-profile.component.css']
})
export class TeacherProfileComponent implements OnInit {

  username!: string | undefined | null;

  dataSource: MatTableDataSource<Tests> = new MatTableDataSource();
  @ViewChild(MatPaginator) paginator! : MatPaginator;

  constructor(
    private authService: AuthService,
    private router : Router,
    private toastrService: ToastrService
  ) { }

  ngOnInit(): void {
    let sub = this.authService.getCurrentUser().subscribe(response =>{
      this.username = response?.displayName
      sub.unsubscribe()
    })
  }

  logout(): void{
    this.authService.logout().subscribe(response =>{
      this.toastrService.success("Logged Out Successfully")
      this.router.navigateByUrl("/")
    })
  }

}
