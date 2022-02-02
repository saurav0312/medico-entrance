import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { User } from '../../interface/user';
import { ProfileService } from '../../service/profile.service'
import { AuthService } from '../../service/auth.service'
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-editprofileinfo',
  templateUrl: './editprofileinfo.component.html',
  styleUrls: ['./editprofileinfo.component.css']
})
export class EditprofileinfoComponent implements OnInit, OnDestroy {

  profileForm!: FormGroup;
  userDetail! : User;

  firstName!: string;
  lastName!: string;
  email!: string;
  country!: string | undefined;
  imageUrl!: string | undefined;

  constructor(
    private profileService: ProfileService,
    private authService: AuthService,
  ) { }

  ngOnInit(): void {
    this.profileForm = new FormGroup(
      {
        firstName: new FormControl('',[Validators.required]),
        lastName: new FormControl('',[Validators.required]),
        email : new FormControl('', [Validators.required, Validators.email]),
        phoneNumber: new FormControl(''),
        address: new FormControl(''),
        education: new FormControl(''),
        country: new FormControl(''),
        state: new FormControl(''),
        imageUrl: new FormControl('')
      }
    );

        this.authService.currentUser$.subscribe(response =>{
        this.profileService.getUserDetails(response?.uid).subscribe(response=>{
        console.log("After signout")
        if(response!== undefined){
          this.profileForm.setValue(response)
          this.firstName = response.firstName
          this.lastName = response.lastName 
          this.email = response.email
          this.country = response.country
          this.imageUrl = response.imageUrl;
        }
      })
    })
  }

  ngOnDestroy(): void {
      
  }

  clearForm(){
    this.profileForm.reset();
    this.ngOnInit();

  }

  saveProfile(){
    this.userDetail = this.profileForm.value
    console.log("User Detail: ", this.userDetail)
    this.authService.currentUser$.subscribe(response =>{
      this.userDetail.imageUrl ="assets/img/person/person.png"
      this.profileService.updateUserDetails(response?.uid,this.userDetail).subscribe(response =>{
        console.log(response)
      })
    })
  }

}
