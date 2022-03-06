import { Component, ElementRef, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { DiscussionQuestion } from 'src/app/interface/discussion-question';
import { AuthService } from 'src/app/service/auth.service';
import { ProfileService } from 'src/app/service/profile.service'

@Component({
  selector: 'app-discussion-question-component',
  templateUrl: './discussion-question-component.component.html',
  styleUrls: ['./discussion-question-component.component.css']
})
export class DiscussionQuestionComponentComponent implements OnInit {

  question:string = '';
  loading =  false;
  userId! : string;
  userName!: string;
  userImage!: string | undefined;

  discussionQuestionForm!: FormGroup;

  commonFormFieldsName : string[] =['headerTemplate', 'questionTemplate', 'questionSubjectTemplate', 'questionTagTemplate'];
  commonFormFieldsTemplateList: any;


  @ViewChild('headerTemplate', {static:true} ) headerTemplate! : TemplateRef<ElementRef>;
  @ViewChild('questionTemplate', {static:true} ) questionTemplate! : TemplateRef<ElementRef>;
  @ViewChild('questionSubjectTemplate', {static:true} ) questionSubjectTemplate! : TemplateRef<ElementRef>;
  @ViewChild('questionTagTemplate', {static:true} ) questionTagTemplate! : TemplateRef<ElementRef>;

  constructor(private profileService: ProfileService, public ref: DynamicDialogRef, public config: DynamicDialogConfig, 
            private authService: AuthService,
            private messageService: MessageService
            ) 
  { }

  ngOnInit(): void {

    this.commonFormFieldsTemplateList = {'headerTemplate': this.headerTemplate, 'questionTemplate': this.questionTemplate, 
                                        'questionSubjectTemplate':this.questionSubjectTemplate , 'questionTagTemplate': this.questionTagTemplate };

    this.discussionQuestionForm = new FormGroup({
      'question': new FormControl('', Validators.required),
      'questionSubject': new FormControl('', Validators.required),
      'questionTags': new FormControl('', Validators.required)
    })


    this.authService.getCurrentUser().subscribe(currentUser =>{
      this.userId = currentUser.uid
      this.userName = currentUser.displayName
      this.profileService.getUserDetails(this.userId).subscribe(userDetails =>{
        this.userImage= userDetails.imageUrl
      })

      // this.authService.readDiscussionQuestions().subscribe(allDiscussionQuestions =>{
      //   console.log("Discussion questions: ", allDiscussionQuestions)
      // })
    })
  }

  submitQuestion(){

    this.loading= true;

    let questionTags: string[] = [];
    questionTags.push(this.discussionQuestionForm.get('questionTags')?.value)

    let discussionQuestionData: DiscussionQuestion ={
      'question': this.discussionQuestionForm.get('question')?.value,
      'questionSubject': this.discussionQuestionForm.get('questionSubject')?.value,
      'questionTags': questionTags,
      'questionAskedBy': this.userId,
      'questionAskedByUsername': this.userName,
      'questionAskedByImage': this.userImage,
      'questionAskedDate': new Date(),
      'questionUpVotesCount': 0,
      'questionDownVotesCount': 0,
      'allAnswers': [],
      'upVotedBy':[],
      'downVotedBy':[],
      'isUpVotedByCurrentLoggedInUser': false,
      'isDownVotedByCurrentLoggedInUser': false
    }
    this.authService.addDiscussionQuestion(discussionQuestionData).subscribe(response =>{
      this.loading = false;
      this.messageService.add({severity:'success', summary: 'Your question has been added successfully.'});
      this.ngOnInit()
      this.ref.close("Success");
    },
    error =>{
      this.loading = false;
      window.alert(error.message)
    })
  }

  clearForm(){
    this.discussionQuestionForm.reset()
    this.ngOnInit()
  }

}
