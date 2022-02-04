import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { User } from '../../interface/user';
import { ProfileService } from '../../service/profile.service'
import { AuthService } from '../../service/auth.service'
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-editprofileinfo',
  templateUrl: './editprofileinfo.component.html',
  styleUrls: ['./editprofileinfo.component.scss']
})
export class EditprofileinfoComponent implements OnInit, OnDestroy {

  userId: string | undefined;
  selectedProfileImage!: Blob;

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
    private toastrService: ToastrService
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
          this.userId = response?.uid
          this.profileService.getUserDetails(this.userId).subscribe(response=>{
            console.log("After signout")
            if(response!== undefined){
              console.log(response.imageUrl)
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
    //this.profileService.uploadProfileImage(this.selectedProfileImage, this.userId).subscribe(downloadUrl =>{
      //console.log(downloadUrl)
      this.userDetail.imageUrl = this.imageUrl
      this.profileService.updateUserDetails(this.userId,this.userDetail).subscribe(response =>{
        console.log(response)
        this.toastrService.success("Profile Updated Successfully")
      })
    //})
    // this.userDetail.imageUrl ="assets/img/person/person.png"
  }

  loadProfileImage(event: any):void{
    console.log(event)
    const target: DataTransfer = <DataTransfer>(event.target)
    if(target.files.length !== 1){
      throw new Error("Cannot upload multiple files!")
    }

    this.selectedProfileImage = target.files[0];
    console.log(this.selectedProfileImage)

    this.profileService.uploadProfileImage(this.selectedProfileImage, this.userId).subscribe(response =>{
      this.imageUrl = response
      this.saveProfile();
    })
  }

}
