import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { Tests } from '../../interface/tests';
import { AuthService } from '../../service/auth.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { Router } from '@angular/router';
import { ProfileService } from 'src/app/service/profile.service';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-teacher-profile',
  templateUrl: './teacher-profile.component.html',
  styleUrls: ['./teacher-profile.component.css']
})
export class TeacherProfileComponent implements OnInit {

  username!: string | undefined | null;
  profileImageUrl: string | undefined ='';

  dataSource: MatTableDataSource<Tests> = new MatTableDataSource();
  @ViewChild(MatPaginator) paginator! : MatPaginator;

  constructor(
    private authService: AuthService,
    private router : Router,
    private profileService: ProfileService,
    private messageService: MessageService
  ) { }

  ngOnInit(): void {
    let sub = this.authService.getCurrentUser().subscribe(response =>{
      this.profileService.getUserDetails(response.uid).subscribe(userDetails =>{
        this.username = userDetails.firstName
        this.profileImageUrl = userDetails.imageUrl
      })
      sub.unsubscribe()
    })
  }

  logout(): void{
    this.authService.logout().subscribe(response =>{
      this.messageService.add({severity:'success', summary: 'Logged Out successfully'});
      this.router.navigateByUrl("/")
    })
  }

}
