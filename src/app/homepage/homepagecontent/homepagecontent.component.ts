import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/service/auth.service';
import { ProfileService } from 'src/app/service/profile.service';

@Component({
  selector: 'app-homepagecontent',
  templateUrl: './homepagecontent.component.html',
  styleUrls: ['./homepagecontent.component.css']
})
export class HomepagecontentComponent implements OnInit {

  constructor(
    private router : Router,
    private authService: AuthService,
    private profileService: ProfileService
  ) { }

  ngOnInit(): void {
    // this.authService.currentUser$.subscribe(response =>{
    //   if(response !== null){
    //     const sub = this.profileService.getUserDetails(response.uid).subscribe(response =>{
    //       if(response !== undefined){
    //         sub.unsubscribe()
    //         if(response.accountType === 'teacher'){
    //           this.router.navigateByUrl('/teacherdashboard')
    //         }
    //         else{
    //           this.router.navigateByUrl('/studentdashboard')
    //         }
    //       }
    //     })
    //   }
    // })
  }

  signUpPage(): void{
    this.router.navigateByUrl("/authentication/chooseSignUpOption")
  }

  registerAsInstitute(): void{
    this.router.navigateByUrl("/authentication/registerInstitute")
  }

}
