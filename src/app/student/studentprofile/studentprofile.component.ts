import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { TestReportData } from '../../interface/testReportData';
import { Tests } from '../../interface/tests';
import { AuthService } from '../../service/auth.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { ToastrService } from 'ngx-toastr';
import { NavigationExtras, Router } from '@angular/router';
import { TestReportQuestion } from '../../interface/testReportQuestion';
import { ProfileService } from 'src/app/service/profile.service';


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
  profileImageUrl: string | undefined ='';

  dataSource: MatTableDataSource<Tests> = new MatTableDataSource();
  @ViewChild(MatPaginator) paginator! : MatPaginator;

  constructor(
    private authService: AuthService,
    private router : Router,
    private toastrService: ToastrService,
    private profileService: ProfileService
  ) { }

  ngOnInit(): void {
    let sub = this.authService.getCurrentUser().subscribe(response =>{
      this.profileService.getUserDetails(response.uid).subscribe(userDetails =>{
        this.username = userDetails.firstName
        this.profileImageUrl = userDetails.imageUrl
        console.log("Image url: ", this.profileImageUrl)
      })
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
