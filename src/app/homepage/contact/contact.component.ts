import { Component, ElementRef, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ProgressSpinnerMode } from '@angular/material/progress-spinner';
import { ToastrService } from 'ngx-toastr';
import { ContactRequest } from 'src/app/interface/contact-request';
import { AuthService } from 'src/app/service/auth.service';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.css']
})
export class ContactComponent implements OnInit {

  contactForm!: FormGroup;
  loading: boolean = false;
  mode: ProgressSpinnerMode  = "indeterminate";

  commonFormFieldsName : string[] =['contactHeaderTemplate', 'nameTemplate', 'emailTemplate', 'messageTemplate'];
  commonFormFieldsTemplateList: any;

  @ViewChild('contactHeaderTemplate', {static:true} ) contactHeaderTemplate! : TemplateRef<ElementRef>;
  @ViewChild('nameTemplate', {static:true} ) nameTemplate! : TemplateRef<ElementRef>;
  @ViewChild('emailTemplate', {static:true} ) emailTemplate! : TemplateRef<ElementRef>;
  @ViewChild('messageTemplate', {static:true} ) messageTemplate! : TemplateRef<ElementRef>;

  constructor(
    private authService: AuthService,
    private toastrService: ToastrService
  ) { }

  ngOnInit(): void {

    this.commonFormFieldsTemplateList = {'emailTemplate':this.emailTemplate , 'contactHeaderTemplate': this.contactHeaderTemplate,
                                        'nameTemplate':this.nameTemplate , 'messageTemplate': this.messageTemplate };

    this.contactForm = new FormGroup(
      {
        name: new FormControl('',[Validators.required]),
        email : new FormControl('', [Validators.required, Validators.email]),
        message: new FormControl('')
      }
    );
  }

  submitForm(){
    this.loading= true;

    let contactRequestData: ContactRequest ={
      'name': this.contactForm.get('name')?.value,
      'email': this.contactForm.get('email')?.value,
      'message': this.contactForm.get('message')?.value
    }
    this.authService.createContactRequest(contactRequestData).subscribe(response =>{
      this.loading = false;
      this.toastrService.success("Contact request sent successfully.")
      this.ngOnInit()
    },
    error =>{
      window.alert(error.message)
    })
  }

  clearForm(){
    this.contactForm.reset()
    this.ngOnInit()
  }

}
