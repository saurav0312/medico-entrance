import { AfterViewInit, Component, HostListener, OnInit, ViewChild } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';
import { BehaviorSubject } from 'rxjs';

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


  constructor() { }

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

}
