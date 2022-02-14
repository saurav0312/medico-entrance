import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Route } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { MockTest } from 'src/app/interface/mockTest';
import { Question } from 'src/app/interface/question';
import { AuthService } from 'src/app/service/auth.service';

@Component({
  selector: 'app-editmocktest',
  templateUrl: './editmocktest.component.html',
  styleUrls: ['./editmocktest.component.css']
})
export class EditmocktestComponent implements OnInit {

  testId!: string;
  mockTest! : MockTest;
  testQuestions!: Array<Question>;
  selectedValue: number = 0;
  testType!: string;

  modifyMockTestForm!: FormGroup;
  loading: boolean = false;
  questionError: Array<boolean> = [];
  optionsName: Array<string> = ['optionA','optionB','optionC','optionD']

  constructor(
    private route: ActivatedRoute,
    private authService: AuthService,
    private toastrService: ToastrService
  ) { }

  ngOnInit(): void {
    this.loading = true

    this.modifyMockTestForm = new FormGroup(
      {
        testName: new FormControl('',[Validators.required]),
        testTakenBy: new FormControl('',[Validators.required]),
        totalTime : new FormControl('', [Validators.required, Validators.min(1)]),
        totalNumberOfQuestions: new FormControl('', [Validators.required]),
        testType: new FormControl('', [Validators.required]),
        testPrice: new FormControl(''),
        question: new FormControl('',[Validators.required]),
        optionA: new FormControl('',[Validators.required]),
        optionB: new FormControl('',[Validators.required]),
        optionC: new FormControl('',[Validators.required]),
        optionD: new FormControl('',[Validators.required]),
        correctAnswer: new FormControl('',[Validators.required]),
      }
    );

    this.route.queryParams.subscribe( (response:any) =>{
      this.testId = <string>response.testId
      this.authService.getMockTestByID(this.testId).subscribe((response:MockTest) =>{
        console.log("Edit test: ", response)
        this.testQuestions = response.questions
        this.testType = response['testType']

        this.modifyMockTestForm.get('testName')?.setValue(response['testName'])
        this.modifyMockTestForm.get('testTakenBy')?.setValue(response['testTakenBy'])
        this.modifyMockTestForm.get('totalTime')?.setValue(response['totalTime'])
        this.modifyMockTestForm.get('totalNumberOfQuestions')?.setValue(response['totalNumberOfQuestions'])
        this.modifyMockTestForm.get('testType')?.setValue(response['testType'])
        this.modifyMockTestForm.get('testPrice')?.setValue(response['testPrice'])

        this.modifyMockTestForm.get('question')?.setValue(this.testQuestions[0].question)
        this.modifyMockTestForm.get('optionA')?.setValue(this.testQuestions[0].options[0])
        this.modifyMockTestForm.get('optionB')?.setValue(this.testQuestions[0].options[1])
        this.modifyMockTestForm.get('optionC')?.setValue(this.testQuestions[0].options[2])
        this.modifyMockTestForm.get('optionD')?.setValue(this.testQuestions[0].options[3])
        this.modifyMockTestForm.get('correctAnswer')?.setValue(this.testQuestions[0].correctAnswer)
        this.loading = false
      })
    })
  }

  modifyMockTest():void{
    this.loading = true;
    console.log("Modified test data: ", this.modifyMockTestForm.getRawValue())
    let checkPassed = true;

    this.testQuestions.forEach(question =>{
      if(question.options.findIndex(ele => ele === question.correctAnswer) === -1){
        this.toastrService.error("Correct answer should match one of the options.")
        checkPassed = false;
        this.loading = false;
      }
    })

    if(checkPassed == true){
      let testDetail: MockTest ={
        "testName": this.modifyMockTestForm.get('testName')?.value,
        "testTakenBy": this.modifyMockTestForm.get('testTakenBy')?.value,
        "totalTime": this.modifyMockTestForm.get('totalTime')?.value,
        "totalNumberOfQuestions": this.modifyMockTestForm.get('totalNumberOfQuestions')?.value,
        "testType": this.modifyMockTestForm.get('testType')?.value,
        "testPrice": this.modifyMockTestForm.get('testPrice')?.value,
        "questions": this.testQuestions
      }
      this.authService.updateMockTestDetails(this.testId, testDetail).subscribe(response =>{
        this.toastrService.success("Test modified successfully")
        this.loading = false;
        this.selectedValue = 0;
      })
    }

  }

  clearForm():void{
    this.ngOnInit()
  }

  testTypeChanged(event: any){
    if(event['value']=='Free'){
      console.log("Test type free")
      this.modifyMockTestForm.get('testPrice')?.setValue(0);
    }
  }

  updateQuestion(index: number, event: any){
    if(event.target.value == ''){
      //this.questionError.push(true);
    }
    else{
      this.testQuestions[index].question = event.target.value
      //this.questionError.pop()
    }
  }

  updateOption(questionIndex: number, optionIndex: number, event: any){
    if(event.target.value == ''){
      //this.questionError.push(true);
    }
    else{
      this.testQuestions[questionIndex].options[optionIndex] = event.target.value
      //this.questionError.pop()
    }
  }

  updateCorrectAnswer(index: number, event: any){
    if(event.target.value == ''){
      //this.questionError.push(true);
    }
    else{
      this.testQuestions[index].correctAnswer = event.target.value
      //this.questionError.pop()
    }
  }

}
