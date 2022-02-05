import { HttpClient } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../service/auth.service';
import { ToastrService } from 'ngx-toastr';
import { ProgressSpinnerMode } from '@angular/material/progress-spinner';
import { finalize } from 'rxjs';
import { ProfileService } from 'src/app/service/profile.service';

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

  constructor(
    private router : Router, 
    private httpClient : HttpClient,
    private activatedRoute: ActivatedRoute,
    private authService: AuthService,
    private profileService: ProfileService,
    private toastrService: ToastrService,
    private fb: FormBuilder
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
          this.loading=false;
        } )
      ).subscribe(
        () =>{
          this.authService.currentUser$.subscribe((response) => {
            console.log("Current user: ", response)
            this.profileService.getUserDetails(response?.uid).subscribe(response =>{
              if(response.accountType === 'student'){
                this.router.navigateByUrl("/studentdashboard")
              }
              else{
                this.router.navigateByUrl("/teacherdashboard")
              }
            })
            this.toastrService.success("User Logged In")
          })
          
        },
        error =>{
          window.alert(error.message)
        }
      )
     }
  }


  clearForm() : void{
    this.loginForm.reset();
    this.ngOnInit();
  }


}
