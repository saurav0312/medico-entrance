import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AuthService } from '../../service/auth.service';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';

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
    private messageService: MessageService
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
        this.messageService.add({severity:'success', summary: 'Password reset mail sent successfully'});
        this.router.navigateByUrl("/")
      },
      error =>{
        this.loading = false;
        window.alert(error.message)
      }
    )
  }

}
