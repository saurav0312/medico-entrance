import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AuthService } from '../../service/auth.service';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-forgetpassword',
  templateUrl: './forgetpassword.component.html',
  styleUrls: ['./forgetpassword.component.css']
})
export class ForgetpasswordComponent implements OnInit {

  changePasswordForm!: FormGroup;
  loading: boolean = false;

  constructor(
    private router : Router, 
    private authService: AuthService,
    private toastrService: ToastrService
    ) { }

  ngOnInit(): void {
    this.changePasswordForm = new FormGroup(
      {
        email : new FormControl('', [Validators.required, Validators.email])
      }
    );
  }

  changePassword(): void{
    this.loading = true;
    this.authService.changePassword(this.changePasswordForm).subscribe(
      response =>{
        this.loading = false;
        this.toastrService.success("Password reset mail sent successfully")
        this.router.navigateByUrl("/")
      },
      error =>{
        this.loading = false;
        window.alert(error.message)
      }
    )
  }

}
