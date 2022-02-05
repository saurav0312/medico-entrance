import { Component, Input, OnInit } from '@angular/core';
import { AuthService } from '../../service/auth.service';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-studentdashboardnavigationbar',
  templateUrl: './studentdashboardnavigationbar.component.html',
  styleUrls: ['./studentdashboardnavigationbar.component.css']
})
export class StudentdashboardnavigationbarComponent implements OnInit {

  @Input() noOfMockTest : number = 0;
  navOpen: boolean = false;

  constructor(
    private authService :  AuthService,
    private toastrService: ToastrService,
    private router : Router
  ) { }

  ngOnInit(): void {
    this.authService.mock$.subscribe((response: any) =>{
      this.noOfMockTest = response.length
  })

  }

  logout(): void{
    this.authService.logout().subscribe(response =>{
      this.toastrService.success("Logged Out Successfully")
      this.router.navigateByUrl("/")
    })
  }

  toggleNavBar(){
    this.navOpen = !this.navOpen;
  }

}
