import { HttpClient } from '@angular/common/http';
import { AfterViewInit, Component, ElementRef, HostListener, Input, OnDestroy, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../service/auth.service';
import { Userr } from '../../interface/user';
import { ProfileService } from '../../service/profile.service';
import { ProgressSpinnerMode } from '@angular/material/progress-spinner';
import { BehaviorSubject, finalize } from 'rxjs';
import { MessageService } from 'primeng/api';
import { DialogService } from 'primeng/dynamicdialog';
import { DiscussionQuestionComponentComponent } from '../../student/discussion-question-component/discussion-question-component.component';
import { SendTeacherCodeComponent } from '../send-teacher-code/send-teacher-code.component';
import { TeacherCodeRequestI } from 'src/app/interface/teacher-code-request-i';

@Component({
  selector: 'app-choosesignupoption',
  templateUrl: './choosesignupoption.component.html',
  styleUrls: ['./choosesignupoption.component.scss'],
  providers: [DialogService]
})
export class ChoosesignupoptionComponent implements OnInit, AfterViewInit {

  // @Input() selectedIndex = 0;

  mode: ProgressSpinnerMode  = "indeterminate";
  loading : boolean = false;

  isTeacher: boolean = false;
  isStudent: boolean = false;

  userDetail!: Userr

  signUpForm!: FormGroup;
  tempSignUpForm!: FormGroup;
  loginHide: boolean = true;
  signupHide: boolean = true;

  @ViewChild('firstNameTemplate', {static:true} ) firstNameTemplate! : TemplateRef<ElementRef>;
  @ViewChild('lastNameTemplate', {static:true} ) lastNameTemplate! : TemplateRef<ElementRef>;
  @ViewChild('emailTemplate', {static:true} ) emailTemplate! : TemplateRef<ElementRef>;
  @ViewChild('phoneNumberTemplate', {static:true} ) phoneNumberTemplate! : TemplateRef<ElementRef>;
  @ViewChild('passwordTemplate', {static:true} ) passwordTemplate! : TemplateRef<ElementRef>;

  nameFormFieldsTemplateList: any;
  nameFormFieldsName : string[] = ['firstNameTemplate', 'lastNameTemplate']

  commonFormFieldsName : string[] =['phoneNumberTemplate', 'emailTemplate', 'passwordTemplate'];
  commonFormFieldsTemplateList: any;

  selectedIndex: number = 0;

  screenWidth!: number;

  isMobileView: boolean = false;

  private screenWidth$ = new BehaviorSubject<number>(window.innerWidth);

  teacherCodeId: string ='';
  showTeacherCode: boolean = false;

  @HostListener('window:resize', ['$event'])
    onResize(event: any) {
        if (event.target.innerWidth < 510) {
          this.isMobileView = true;
        }
        else{
          this.isMobileView = false;
        }
    }

  

  constructor(
    private router : Router, 
    private httpClient : HttpClient,
    private activatedRoute: ActivatedRoute,
    private authService: AuthService,
    private fb: FormBuilder,
    private profileService: ProfileService,
    private messageService : MessageService,
    public dialogService: DialogService
    ) { }

    ngAfterViewInit(): void {
      this.screenWidth$.subscribe(width => {
        if (width < 510) {
          this.isMobileView = true;
        }
        else{
          this.isMobileView = false;
        }
      });
    }

  ngOnInit(): void {

    this.signUpForm = new FormGroup(
      {
        firstName: new FormControl('',[Validators.required]),
        lastName: new FormControl('',[Validators.required]),
        phoneNumber: new FormControl('',[Validators.maxLength(10)]),
        email : new FormControl('', [Validators.required, Validators.email]),
        password: new FormControl('', [Validators.required, Validators.minLength(5)]),
        teacherCode: new FormControl('')
      }
    );

    this.nameFormFieldsTemplateList = {'firstNameTemplate':this.firstNameTemplate , 'lastNameTemplate': this.lastNameTemplate };
    this.commonFormFieldsTemplateList = {'phoneNumberTemplate':this.phoneNumberTemplate, 'emailTemplate':this.emailTemplate , 'passwordTemplate': this.passwordTemplate };

  }

  ngOnDestroy(): void {
    
  }

  signUp(): void{
    this.loading= true;

    this.tempSignUpForm = this.signUpForm
    delete this.tempSignUpForm.value['password']

    let teacherCodeRequestData: TeacherCodeRequestI = {
      "email": this.signUpForm.get('email')?.value,
      "isVerified": false
    }

    //teacher is registering
    if(this.selectedIndex === 1){
      let sub = this.authService.getExistingTeacherCode(teacherCodeRequestData).subscribe(existingTeacherCode =>{
        sub.unsubscribe()

        console.log("Existing teacher code data: ", existingTeacherCode)
        //this teacher's email is added in teachercoderequests table
        if(existingTeacherCode!== undefined && existingTeacherCode.length > 0){
          let teacherCodeFromDb = existingTeacherCode[0].id
          let teacherCodeFromForm = this.signUpForm.get('teacherCode')?.value
          //teacher code didn't match
          if(teacherCodeFromDb !== teacherCodeFromForm){
            this.loading =false;
            this.messageService.add({severity:'error',summary:'Please provide correct teacher code'})
          }
          //teacher code matched
          else{
            this.registerUser()
          }
        }
        //the provided email is not in teachercoderequests table
        else{
          this.loading =false;
          this.messageService.add({severity:'error',summary:'No teacher code exists for the provided email id'})
        }
      })
    }
    //student is registering
    else{
      this.registerUser()
    }
  }


  registerUser(){
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
            'phoneNumber': this.signUpForm.get('phoneNumber')?.value,
            'address': '',
            'education': '',
            'country': '',
            'state': '',
            'imageUrl': 'assets/img/person/person.png',
            'accountType': this.selectedIndex == 1 ? 'teacher' : 'student'
          }

          if(this.selectedIndex == 1){
            tempUserDetail.teacherCode = this.signUpForm.get('teacherCode')?.value
          }

          this.userDetail = tempUserDetail

          this.profileService.updateUserDetails(response?.uid, this.userDetail).subscribe(response =>{
          })

          this.authService.sendVerificationEmail(response).subscribe(() =>{
            this.messageService.add({severity:'success', summary: 'Verification mail has been sent'});
            this.router.navigateByUrl("/home")
            sub.unsubscribe()
          })
        },
        error=>{
          this.loading = false;
          window.alert(error.message)
        })
      },
      error =>{
        this.loading = false;
        window.alert(error.message)
      }
    )
  }

  clearForm() : void{
    this.signUpForm.reset();
    this.ngOnInit();
  }

  sendTeacherCode(): void{
    // let email = this.signUpForm.get('email')?.value
    // if(email !== ''){
    //   this.messageService.add({severity:'success', summary: 'Teacher code has been sent to the provided email'});
    // }
    // else{
    //   this.messageService.add({severity:'error', summary: 'Please enter email id.'});
    // }

    const ref = this.dialogService.open(SendTeacherCodeComponent, {
      header: 'Request For Code',
      width: this.isMobileView ? '70%' : '20%'
    });

    ref.onClose.subscribe((teacherCodeRequest: string) => {
      console.log("teacherCodeRequest: ", teacherCodeRequest)
      if (teacherCodeRequest) {
        this.teacherCodeId = teacherCodeRequest
        this.showTeacherCode = true;
      }
    });
  }

  signIn(): void{
    this.router.navigate(["../","signin"], {relativeTo:this.activatedRoute})
  }

  tabChanged(event?:any){
    this.signUpForm.reset();
    this.ngOnInit();
  }

  changeAccountType(index: number){
    this.selectedIndex = index;
    this.tabChanged()
  }

}
