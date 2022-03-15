import { Component, HostListener, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSidenav } from '@angular/material/sidenav';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { BehaviorSubject } from 'rxjs';
import { Tests } from 'src/app/interface/tests';
import { AuthService } from 'src/app/service/auth.service';
import { ProfileService } from 'src/app/service/profile.service';

@Component({
  selector: 'app-teacherdashboardhome',
  templateUrl: './teacherdashboardhome.component.html',
  styleUrls: ['./teacherdashboardhome.component.css']
})
export class TeacherdashboardhomeComponent implements OnInit {

  username!: string | undefined | null;
  profileImageUrl: string | undefined ='';

  dataSource: MatTableDataSource<Tests> = new MatTableDataSource();
  @ViewChild(MatPaginator) paginator! : MatPaginator;

  @ViewChild('sidenav') sidenav! : MatSidenav;

  screenWidth!: number;

  private screenWidth$ = new BehaviorSubject<number>(window.innerWidth);


  @HostListener('window:resize', ['$event'])
    onResize(event: any) {
      console.log("Window resize: ", event)
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
      console.log("Scree width: ", width)
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
