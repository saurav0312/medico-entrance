import { HttpClient } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../service/auth.service';
import { ToastrService } from 'ngx-toastr';
import { environment } from 'src/environments/environment';
import { map } from 'rxjs'

const realtimeDatabaseUrl = environment.firebase.realtimeDatabaseUrl

@Component({
  selector: 'app-chooseentryoption',
  templateUrl: './chooseentryoption.component.html',
  styleUrls: ['./chooseentryoption.component.css']
})
export class ChooseEntryOptionComponent implements OnInit {

  @Input() selectedIndex = 0;

  isTeacher: boolean = false;
  isStudent: boolean = false;

  loginForm!: FormGroup;
  signUpForm!: FormGroup;
  tempSignUpForm!: FormGroup;
  loginHide: boolean = true;
  signupHide: boolean = true;

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

    this.signUpForm = new FormGroup(
      {
        firstName: new FormControl('',[Validators.required]),
        lastName: new FormControl('',[Validators.required]),
        email : new FormControl('', [Validators.required, Validators.email]),
        password: new FormControl('', [Validators.required, Validators.minLength(5)]),
        teacherCode: new FormControl('')
      }
    );

  }

  login(): void{
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

  signUp(): void{
    this.tempSignUpForm = this.signUpForm
    delete this.tempSignUpForm.value['password']
    this.authService.signUpUser(this.signUpForm).subscribe(
      () =>{
        this.httpClient.post(realtimeDatabaseUrl +"users.json", this.tempSignUpForm.value).subscribe(res =>{
        });
        this.authService.currentUser$.subscribe(response => {
          this.authService.sendVerificationEmail(response).subscribe(() =>{
            this.toastrService.success("Verification mail has been sent", "User Registered")
            this.router.navigate(["../","home"], {relativeTo:this.activatedRoute})
          })
        })
      },
      error =>{
        window.alert(error.message)
      }
    )
  }

  clearForm() : void{
    this.loginForm.reset();
    this.signUpForm.reset();
    this.ngOnInit();
  }

  forgetPassword() : void{
    this.router.navigateByUrl('/forgetPassword')
  }

  sendTeacherCode(): void{
    console.log("Send a teacher code")
    this.toastrService.success("Teacher code has been sent to the provided email")
  }

  setObject(value: any) : void{
    //in case of teacher
    if(value === 1){
      this.isTeacher = true
      this.isStudent = false
    }
    //in case of student
    else{
      this.isTeacher = false
      this.isStudent = true
    }
  }


  signIn(): void{
    this.router.navigate(["../","signin"], {relativeTo:this.activatedRoute})
  }
}
