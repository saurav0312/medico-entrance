import { Component, Input, OnInit } from '@angular/core';
import { AuthService } from '../../service/auth.service';
import { Router } from '@angular/router';
import { ProfileService } from 'src/app/service/profile.service';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-teacherdashboardnavigationbar',
  templateUrl: './teacherdashboardnavigationbar.component.html',
  styleUrls: ['./teacherdashboardnavigationbar.component.css']
})
export class TeacherdashboardnavigationbarComponent implements OnInit {

  profileImageUrl!: string | undefined;
  navOpen: boolean = false;
  dropdownOpen: boolean = false;

  constructor(
    private authService :  AuthService,
    private router : Router,
    private profileService: ProfileService,
    private messageService: MessageService
  ) { }

  ngOnInit(): void {
  let sub = this.authService.getCurrentUser().subscribe(response =>{
    this.profileService.getUserDetails(response?.uid).subscribe(response =>{
      this.profileImageUrl = response.imageUrl
      sub.unsubscribe()
    })
  })

  }

  logout(): void{
    this.authService.logout().subscribe(response =>{
      this.messageService.add({severity:'success', summary: 'Logged out successfully'});
      this.router.navigateByUrl("/home/homepagecontent")
    })
  }

  toggleNavBar(){
    this.navOpen = !this.navOpen;
  }

  toggleDropdown(){
    this.dropdownOpen = !this.dropdownOpen;
  }


}
