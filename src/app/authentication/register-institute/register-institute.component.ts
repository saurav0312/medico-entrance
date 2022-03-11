import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ProgressSpinnerMode } from '@angular/material/progress-spinner';
import { MessageService } from 'primeng/api';
import { finalize } from 'rxjs';
import { InstituteDetail } from 'src/app/interface/institute-detail';
import { Userr } from 'src/app/interface/user';
import { AuthService } from 'src/app/service/auth.service';
import { ProfileService } from 'src/app/service/profile.service';

@Component({
  selector: 'app-register-institute',
  templateUrl: './register-institute.component.html',
  styleUrls: ['./register-institute.component.scss']
})
export class RegisterInstituteComponent implements OnInit {

  registerInstitueForm!: FormGroup;
  tempSignUpForm!: FormGroup;
  mode: ProgressSpinnerMode  = "indeterminate";
  loading : boolean = false;
  loginHide: boolean = true;

  constructor(
    private authService: AuthService,
    private profileService: ProfileService,
    private messageService: MessageService
  ) { }

  ngOnInit(): void {

    this.registerInstitueForm = new FormGroup(
      {
        instituteEmail : new FormControl('', [Validators.required, Validators.email]),
        instituteName: new FormControl('', [Validators.required]),
        institutePhoneNumber: new FormControl('', [Validators.required]),
        instituteContactPersonName: new FormControl('', [Validators.required]),
        instituteAddress: new FormControl('', [Validators.required]),
        message: new FormControl('', [Validators.required])
      }
    );
  }

  register(): void{
    this.loading= true;

    this.tempSignUpForm = this.registerInstitueForm

    const tempUserDetail: InstituteDetail = {
      'instituteEmail': this.registerInstitueForm.get('instituteEmail')?.value,
      'instituteName': this.registerInstitueForm.get('instituteName')?.value,
      'institutePhoneNumber': this.registerInstitueForm.get('institutePhoneNumber')?.value,
      'instituteContactPersonName': this.registerInstitueForm.get('instituteContactPersonName')?.value,
      'instituteAddress': this.registerInstitueForm.get('instituteAddress')?.value,
      'message': this.registerInstitueForm.get('message')?.value,
    }

    this.profileService.addInstituteDetails(tempUserDetail).subscribe(response =>{
      this.messageService.add({severity:'success', summary: 'Insitute details added.'});
      this.loading = false
    },
    error =>{
      this.loading = false;
      window.alert(error.error)
    })
  }

}
