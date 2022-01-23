import { Component, OnInit } from '@angular/core';
import { AuthService } from '../service/auth.service';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-dashboardnavigationbar',
  templateUrl: './dashboardnavigationbar.component.html',
  styleUrls: ['./dashboardnavigationbar.component.css']
})
export class DashboardnavigationbarComponent implements OnInit {

  constructor(
    private authService :  AuthService,
    private toastrService: ToastrService,
    private router : Router
  ) { }

  ngOnInit(): void {
  }

  logout(): void{
    this.authService.logout().subscribe(response =>{
      this.toastrService.success("Logged Out Successfully")
      this.router.navigateByUrl("/")
    })
  }

}
