import { HttpClient } from '@angular/common/http';
import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../service/auth.service';
import { ToastrService } from 'ngx-toastr';
import { environment } from 'src/environments/environment';
import { map, Subscription } from 'rxjs'
import { Userr } from '../../interface/user';
import { ProfileService } from '../../service/profile.service';
import { ProgressSpinnerMode } from '@angular/material/progress-spinner';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-choosesignupoption',
  templateUrl: './choosesignupoption.component.html',
  styleUrls: ['./choosesignupoption.component.scss']
})
export class ChoosesignupoptionComponent implements OnInit {

  @Input() selectedIndex = 0;

  mode: ProgressSpinnerMode  = "indeterminate";
  loading : boolean = false;

  isTeacher: boolean = false;
  isStudent: boolean = false;

  userDetail!: Userr

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
    private fb: FormBuilder,
    private profileService: ProfileService
    ) { }

  ngOnInit(): void {

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

  ngOnDestroy(): void {
    
  }

  signUp(): void{
    this.loading= true;

    this.tempSignUpForm = this.signUpForm
    delete this.tempSignUpForm.value['password']
    this.authService.signUpUser(this.signUpForm).pipe(
      finalize(()=>{
        this.loading=false;
      } )
    )
    .subscribe(
      () =>{
        const sub = this.authService.getCurrentUser().subscribe(response => {
          const tempUserDetail: Userr = {
            'firstName': this.signUpForm.get('firstName')?.value,
            'lastName': this.signUpForm.get('lastName')?.value,
            'email': this.signUpForm.get('email')?.value,
            'phoneNumber': 0,
            'address': '',
            'education': '',
            'country': '',
            'state': '',
            'imageUrl': 'assets/img/person/person.png',
            'accountType': this.isTeacher ? 'teacher' : 'student'
          }

          this.userDetail = tempUserDetail

          this.profileService.updateUserDetails(response?.uid, this.userDetail).subscribe(response =>{
            console.log("User Details updated");
          })

          this.authService.sendVerificationEmail(response).subscribe(() =>{
            this.toastrService.success("Verification mail has been sent", "User Registered")
            this.router.navigateByUrl("/home")
            sub.unsubscribe()
          })
        })
      },
      error =>{
        window.alert(error.message)
      }
    )
  }

  clearForm() : void{
    this.signUpForm.reset();
    this.ngOnInit();
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
