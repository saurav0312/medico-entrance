import { AfterViewInit, Component, HostListener, OnInit, ViewChild } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { BehaviorSubject } from 'rxjs';
import { AuthService } from 'src/app/service/auth.service';

@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.css']
})
export class AdminDashboardComponent implements OnInit, AfterViewInit {

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
    private messageService: MessageService,
    private router: Router
  ) { }

  ngOnInit(): void {
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
      this.router.navigateByUrl("/admin")
    })
  }

}
