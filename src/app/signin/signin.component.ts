import { HttpClient } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../service/auth.service';
import { ToastrService } from 'ngx-toastr';
import { environment } from 'src/environments/environment';
import { map } from 'rxjs'

@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.scss']
})
export class SigninComponent implements OnInit {

  loginForm!: FormGroup;
  loginHide: boolean = true;

  constructor(
    private router : Router, 
    private httpClient : HttpClient,
    private activatedRoute: ActivatedRoute,
    private authService: AuthService,
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
    if(this.loginForm.valid){
      this.authService.loginUser(this.loginForm).subscribe(
        () =>{
          this.authService.currentUser$.subscribe((response) => {
            console.log("Current user: ", response)
            this.toastrService.success("User Logged In")
          })
          this.router.navigate(["../","dashboard"], {relativeTo:this.activatedRoute})
        },
        error =>{
          window.alert(error.message)
        }
      )
    }
  }

  forgetPassword() : void{
    this.router.navigateByUrl('/forgetPassword')
  }


  clearForm() : void{
    this.loginForm.reset();
    this.ngOnInit();
  }

}
