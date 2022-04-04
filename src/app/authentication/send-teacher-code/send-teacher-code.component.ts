import { Component, ElementRef, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { DynamicDialogRef } from 'primeng/dynamicdialog';
import { TeacherCodeRequestI } from 'src/app/interface/teacher-code-request-i';
import { AuthService } from 'src/app/service/auth.service';

@Component({
  selector: 'app-send-teacher-code',
  templateUrl: './send-teacher-code.component.html',
  styleUrls: ['./send-teacher-code.component.scss']
})
export class SendTeacherCodeComponent implements OnInit {

  sendTeacherCodeForm!: FormGroup;

  commonFormFieldsName : string[] =['headerTemplate', 'emailTemplate'];
  commonFormFieldsTemplateList: any;

  loading: boolean = false;

  @ViewChild('headerTemplate', {static:true} ) headerTemplate! : TemplateRef<ElementRef>;
  @ViewChild('emailTemplate', {static:true} ) emailTemplate! : TemplateRef<ElementRef>;

  constructor(
    private authService: AuthService,
    private messageService : MessageService,
    public ref: DynamicDialogRef
  ) { }

  ngOnInit(): void {

    this.commonFormFieldsTemplateList = {'headerTemplate': this.headerTemplate, 
                                        'emailTemplate':this.emailTemplate};

    this.sendTeacherCodeForm = new FormGroup({
      'email': new FormControl('', [Validators.required,Validators.email])
    })
  }

  submitRequest(){
    this.loading =true;
    let email = this.sendTeacherCodeForm.get('email')?.value

    let teacherCodeRequestData: TeacherCodeRequestI = {
      "email": email,
      "isVerified": false
    }

    if(email !== undefined && email !==''){
      let sub =this.authService.getExistingTeacherCode(teacherCodeRequestData).subscribe(existingTeacherCode =>{
        console.log("Existing teacher code data: ", existingTeacherCode)
        sub.unsubscribe()
        if(existingTeacherCode === undefined || existingTeacherCode.length == 0){
          this.authService.createTeacherCodeRequest(teacherCodeRequestData).subscribe(teacherCodeRequestAdded =>{
            console.log("added: ", teacherCodeRequestAdded)
            console.log("added teacher code: ", teacherCodeRequestAdded.id)
            //send email
            this.loading = false
            this.messageService.add({severity:'success', summary: 'Teacher code has been sent to the provided email'});
            this.ref.close(teacherCodeRequestAdded.id);
          },
          error =>{
            this.loading = false
            this.messageService.add({severity:'error',summary:error.error})
          })
        }
        else{
          this.messageService.add({severity:'error', summary:'Email is already registered'});
          this.ref.close("Success");
        }
      },
      error =>{
        this.loading =false;
        this.messageService.add({severity:'erorr',summary:error.error})
      })
    }
  }

  clearForm(){
    this.sendTeacherCodeForm.reset()
    this.ngOnInit()
  }

}
