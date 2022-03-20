import { AfterViewInit, Component, HostListener, Input, OnInit, ViewChild } from '@angular/core';
import { Tests } from '../../interface/tests';
import { AuthService } from '../../service/auth.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { Router } from '@angular/router';
import { ProfileService } from 'src/app/service/profile.service';
import { MatSidenav } from '@angular/material/sidenav';
import { BehaviorSubject } from 'rxjs';
import { MessageService } from 'primeng/api';


@Component({
  selector: 'app-studentprofile',
  templateUrl: './studentprofile.component.html',
  styleUrls: ['./studentprofile.component.css']
})
export class StudentprofileComponent implements OnInit, AfterViewInit {

  username!: string | undefined | null;
  profileImageUrl: string | undefined ='';

  dataSource: MatTableDataSource<Tests> = new MatTableDataSource();
  @ViewChild(MatPaginator) paginator! : MatPaginator;

  @ViewChild('sidenav') sidenav! : MatSidenav;

  screenWidth!: number;

  private screenWidth$ = new BehaviorSubject<number>(window.innerWidth);


  @HostListener('window:resize', ['$event'])
    onResize(event: any) {
        if (event.target.innerWidth < 510) {
          
            this.sidenav.close();
            this.sidenav.mode ='over'
        }
        else{
          this.sidenav.open()
          this.sidenav.mode = 'side'
        }
    }

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

  ngAfterViewInit(): void {
    this.screenWidth$.subscribe(width => {
      if (width < 510) {
        this.sidenav.close();
        this.sidenav.mode ='over'
      }
      else{
        this.sidenav.open()
        this.sidenav.mode = 'side'
      }
    });
  }


  logout(): void{
    this.authService.logout().subscribe(response =>{
      this.messageService.add({severity:'success', summary: 'Logged Out Successfully'});
      this.router.navigateByUrl("/")
    })
  }
}
