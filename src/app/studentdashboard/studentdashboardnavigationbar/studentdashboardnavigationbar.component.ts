import { Component, Input, OnInit } from '@angular/core';
import { AuthService } from '../../service/auth.service';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute, Router } from '@angular/router';
import { ProfileService } from 'src/app/service/profile.service';

@Component({
  selector: 'app-studentdashboardnavigationbar',
  templateUrl: './studentdashboardnavigationbar.component.html',
  styleUrls: ['./studentdashboardnavigationbar.component.css']
})
export class StudentdashboardnavigationbarComponent implements OnInit {

  @Input() noOfAllMockTest : number = 0;

  profileImageUrl!: string | undefined;
  navOpen: boolean = false;
  dropdownOpen: boolean = false;

  constructor(
    private authService :  AuthService,
    private toastrService: ToastrService,
    private router : Router,
    private profileService: ProfileService
  ) { }

  ngOnInit(): void {
    this.authService.readMockTest().subscribe((response: any) =>{
      this.noOfAllMockTest = response.length
    })
    let sub = this.authService.getCurrentUser().subscribe(response =>{
      this.profileService.getUserDetails(response?.uid).subscribe(response =>{
        sub.unsubscribe()
        this.profileImageUrl = response.imageUrl
      })
    })
  }

  logout(): void{
    this.authService.logout().subscribe(response =>{
      this.toastrService.success("Logged Out Successfully")
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
