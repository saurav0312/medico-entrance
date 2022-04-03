import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Userr } from '../../interface/user';
import { ProfileService } from '../../service/profile.service'
import { AuthService } from '../../service/auth.service'
import { Timestamp } from 'firebase/firestore';
import { ProgressSpinnerMode } from '@angular/material/progress-spinner';
import { finalize } from 'rxjs';
import { MessageService } from 'primeng/api';
import { DiscussionQuestion } from 'src/app/interface/discussion-question';
import {NgxImageCompressService} from 'ngx-image-compress';

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
  tempProfileForm!: FormGroup;
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
    private messageService: MessageService,
    private imageCompress: NgxImageCompressService
  ) { }

  ngOnInit(): void {
    this.profileForm = new FormGroup(
      {
        firstName: new FormControl('',[Validators.required]),
        lastName: new FormControl('',[Validators.required]),
        email : new FormControl('', [Validators.required, Validators.email]),
        phoneNumber: new FormControl('', [Validators.maxLength(10)]),
        teacherCode: new FormControl({value:'', disabled: true}),
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
                if(response.country !== undefined && response.country !== ''){
                  this.countryChanged(response.country)
                }

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
    this.tempProfileForm = this.profileForm;
    delete this.tempProfileForm.value['teacherCode']
    this.userDetail = this.tempProfileForm.value
    let ti = 1
    this.userDetail.imageUrl = this.imageUrl
    this.profileService.updateUserDetails(this.userId,this.userDetail).pipe(
      finalize( () =>{
        const intervalId = setInterval(()=>{
          ti--;
          if(ti <= 0){
            this.loading = false;
            clearInterval(intervalId);
            this.messageService.add({severity:'success', summary: 'Profile Updated successfully'});
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

    var reader = new FileReader();
    reader.onload = (event: any) => {
      let localUrl = event.target.result;
      this.compressFile(localUrl) 
    }
    reader.readAsDataURL(event.target.files[0]);
  }

  isFileImage(file: Blob): boolean {
    console.log("file in fielllele: ", file)
    return file && file['type'].split('/')[0] === 'image';
  }

  compressFile(image: any){
    var orientation = -1;
    let sizeOfOriginalImage = this.imageCompress.byteCount(image)/(1024*1024);
    console.log('Size in bytes before: ',  sizeOfOriginalImage);
    this.imageCompress.compressFile(image, orientation, 50, 50).then(
      result => {
      let imgResultAfterCompress = result;
      let localCompressedURl = result;
      let sizeOFCompressedImage = this.imageCompress.byteCount(result)/(1024*1024)
      console.warn('Size in bytes after compression:',  sizeOFCompressedImage);
      // call method that creates a blob from dataUri
      this.selectedProfileImage = this.dataURItoBlob(imgResultAfterCompress.split(',')[1]);

      this.uploadProfileImage()
    });
  }

  uploadProfileImage(){
    if(this.isFileImage(this.selectedProfileImage)){
      this.profileService.uploadProfileImage(this.selectedProfileImage, this.userId).subscribe(response =>{
        this.imageUrl = response
        //update image in all questions asked by this user
        let sub = this.authService.readDiscussionQuestionsAskedByAUser(this.userId).subscribe(allAskedQuestions =>{
          sub.unsubscribe()
          allAskedQuestions.forEach((question: DiscussionQuestion) =>{
            question.questionAskedByImage =  this.imageUrl
            this.authService.updateDiscussionQuestion(question.id, question).subscribe(questionImageUpdated =>{
            })
          })
        })
        this.saveProfile();
      })
    }
    else{
      this.loading = false;
      this.messageService.add({severity:'error', summary: 'Please upload image file'});
    }
  }

  dataURItoBlob(dataURI:any) {
    const byteString = window.atob(dataURI);
    const arrayBuffer = new ArrayBuffer(byteString.length);
    const int8Array = new Uint8Array(arrayBuffer);
    for (let i = 0; i < byteString.length; i++) {
    int8Array[i] = byteString.charCodeAt(i);
    }
    const blob = new Blob([int8Array], { type: 'image/jpeg' });
    return blob;
  }


}
