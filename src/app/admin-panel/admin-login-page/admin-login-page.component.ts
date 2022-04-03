import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { AuthService } from 'src/app/service/auth.service';
import { ProfileService } from 'src/app/service/profile.service';

@Component({
  selector: 'app-admin-login-page',
  templateUrl: './admin-login-page.component.html',
  styleUrls: ['./admin-login-page.component.scss']
})
export class AdminLoginPageComponent implements OnInit {

  loginForm!: FormGroup;
  loading : boolean = false;
  loginHide: boolean = true;
  adminEmailId: string  ='';

  constructor(
    private router: Router,
    private messageService: MessageService,
    private authService: AuthService,
    private profileService: ProfileService
  ) { }

  ngOnInit(): void {

    this.profileService.getAllAdminDetails().subscribe(allAdmin =>{
      if(allAdmin !== undefined && allAdmin.length > 0){
        this.adminEmailId = allAdmin[0].email
      }
    })

    this.loginForm = new FormGroup(
      {
        email : new FormControl('', [Validators.required, Validators.email]),
        password: new FormControl('', [Validators.required, Validators.minLength(5)])
      }
    );
  }

  login(){
    this.loading = true;
    if(this.loginForm.get('email')?.value!== this.adminEmailId){
      this.messageService.add({severity:'error',summary:'Invalid email id'})
      this.loading = false;
    }
    else{
      this.authService.loginUser(this.loginForm).subscribe(userLoggedIn =>{
        this.loading = false
        this.messageService.add({severity:'success', summary: 'Admin logged in '});
        this.router.navigateByUrl("/admin/dashboard")
      })
    }
  }

}
