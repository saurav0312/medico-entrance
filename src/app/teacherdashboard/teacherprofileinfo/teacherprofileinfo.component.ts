import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { Userr } from '../../interface/user';
import { ProfileService } from '../../service/profile.service'
import { AuthService } from '../../service/auth.service'
import { ToastrService } from 'ngx-toastr';
import { Timestamp } from 'firebase/firestore';
import { ProgressSpinnerMode } from '@angular/material/progress-spinner';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-teacherprofileinfo',
  templateUrl: './teacherprofileinfo.component.html',
  styleUrls: ['./teacherprofileinfo.component.scss']
})
export class TeacherprofileinfoComponent implements OnInit {

  userId: string | undefined;
  selectedProfileImage!: Blob;

  //For spinner
  mode: ProgressSpinnerMode  = "indeterminate";
  loading : boolean = false;

  today: Date = new Date();

  profileForm!: FormGroup;
  userDetail! : Userr;

  firstName!: string;
  lastName!: string;
  email!: string;
  country!: string | undefined;
  imageUrl!: string | undefined;
  countries: string[] =[];
  countriesWithState!: Array<any>;
  states: string[] = [];
  initialStates: string[] = [];
  stateFilter: string = '';

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
        dob: new FormControl(''),
        address: new FormControl(''),
        education: new FormControl(''),
        country: new FormControl(''),
        state: new FormControl(''),
        imageUrl: new FormControl(''),
        accountType: new FormControl('')
      }
    );

    this.loading = true;

    const sub = this.authService.getCurrentUser() .subscribe(response =>{
      if(response === null || response === undefined){
        //this.toastrService.error("User is not authenticated. Please login first.")
        this.loading = false;
      }
      else{
        this.userId = response?.uid
        const sub = this.profileService.getUserDetails(this.userId)
        .subscribe(response=>{
          if(response === null || response === undefined){
            this.loading = false;
          }
          else{
            sub.unsubscribe();
            if(response!== undefined){
              if(response.dob === undefined){
                  response.dob = new Date();
              }
              else{
                response.dob = (<Timestamp><unknown>(response.dob)).toDate()
              }

              this.profileService.getCountryDetails().subscribe(countryDetails =>{
                this.countriesWithState = countryDetails[0].countriesWithState

                countryDetails[0].countriesWithState.forEach((countryWithState:any) =>{
                  if(this.countries.length == 0 || !this.countries.find(countryName => countryName === countryWithState.countryName))
                    this.countries.push(countryWithState.countryName)
                })
                this.profileForm.setValue(response)
                this.countryChanged(response.country)

                this.firstName = response.firstName
                this.lastName = response.lastName 
                this.email = response.email
                this.country = response.country
                this.imageUrl = response.imageUrl;
                this.loading= false
              },
              error =>{
                this.loading = false;
                window.alert(error.error)
              })
            }
          }
        },
        error =>{
          this.loading = false;
        })
      }
      sub.unsubscribe();
    },
    error =>{
      this.loading = false;
    })
  }

  ngOnDestroy(): void {
      
  }

  countryChanged(countryName: string| undefined){
    let selectedCountry: any = this.countriesWithState.find(country => country.countryName === countryName)
    this.states = selectedCountry.statesName
    this.initialStates = this.states
  }

  filterState(event: any){
    if(event.target.value === '')
    {
      this.states = this.initialStates
    }
    else{
      this.states = this.initialStates.filter(state => state.toLocaleLowerCase().includes( (event.target.value).toLocaleLowerCase()))

    }
  }

  clearForm(){
    this.profileForm.reset();
    this.ngOnInit();

  }

  saveProfile(){
    this.loading = true;
    this.userDetail = this.profileForm.value
    let ti = 1
    this.userDetail.imageUrl = this.imageUrl
    this.profileService.updateUserDetails(this.userId,this.userDetail).pipe(
      finalize( () =>{
        const intervalId = setInterval(()=>{
          ti--;
          if(ti <= 0){
            this.loading = false;
            clearInterval(intervalId);
            this.toastrService.success("Profile Updated Successfully")
            this.ngOnInit()
          }
        },1000)
      })
    )
    .subscribe(response =>{
    })
  }

  loadProfileImage(event: any):void{
    this.loading = true;
    const target: DataTransfer = <DataTransfer>(event.target)
    if(target.files.length !== 1){
      throw new Error("Cannot upload multiple files!")
    }

    this.selectedProfileImage = target.files[0];

    this.profileService.uploadProfileImage(this.selectedProfileImage, this.userId).subscribe(response =>{
      this.imageUrl = response
      this.saveProfile();
    })
  }


}
