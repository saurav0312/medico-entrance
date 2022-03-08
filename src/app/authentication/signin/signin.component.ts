import { HttpClient } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../service/auth.service';
import { ProgressSpinnerMode } from '@angular/material/progress-spinner';
import { finalize } from 'rxjs';
import { ProfileService } from 'src/app/service/profile.service';
import { User } from 'firebase/auth';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.scss']
})
export class SigninComponent implements OnInit {

  loginForm!: FormGroup;
  loginHide: boolean = true;

  mode: ProgressSpinnerMode  = "indeterminate";
  loading : boolean = false;

  loginError: boolean = false;

  constructor(
    private router : Router, 
    private httpClient : HttpClient,
    private activatedRoute: ActivatedRoute,
    private authService: AuthService,
    private profileService: ProfileService,
    private fb: FormBuilder,
    private messageService: MessageService
  ) { }

  ngOnInit(): void {

    this.loginForm = new FormGroup(
      {
        email : new FormControl('', [Validators.required, Validators.email]),
        password: new FormControl('', [Validators.required, Validators.minLength(5)])
      }
    );
  }

  login(): void{
    this.loading= true;
    if(this.loginForm.valid){
      this.authService.loginUser(this.loginForm).pipe(
        finalize(()=>{
          
        } )
      ).subscribe(
        () =>{
          const sub = this.authService.getCurrentUser().subscribe((response:User) => {
            if(response != null){
              if(0){
                // temporarily commenting to use website. later we will enable it
                // sub.unsubscribe()
                // this.loading = false
                // this.authService.logout().subscribe(res =>{
                //   console.log("User logged out as email is not veriifed: ", res)
                // })
              }
              else{
                let subb = this.profileService.getUserDetails(response?.uid).subscribe(response =>{
                  subb.unsubscribe()
                  if(response.accountType === 'student'){
                    sub.unsubscribe();
                    this.loading=false;
                    this.router.navigateByUrl("/studentProfile/studentPageHome")
                  }
                  else{
                    sub.unsubscribe();
                    this.loading=false;
                    this.router.navigateByUrl("/teacherdashboard")
                  }
                })
                this.messageService.add({severity:'success', summary: 'User logged in '});
              }
            }
            else{
              console.log("User is null")
              sub.unsubscribe()
              this.loading = false;
            } 
          })
          
        },
        error =>{
          this.loading = false
          this.loginError = true;
          // window.alert("Invalid Credentials")
        }
      )
     }
  }


  clearForm() : void{
    this.loginForm.reset();
    this.ngOnInit();
  }


}
