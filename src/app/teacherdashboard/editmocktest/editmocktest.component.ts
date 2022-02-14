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
  selectedValue!: number;

  modifyMockTestForm!: FormGroup;
  loading: boolean = false;

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
        testPrice: new FormControl('')
      }
    );

    this.route.queryParams.subscribe( (response:any) =>{
      this.testId = <string>response.testId
      this.authService.getMockTestByID(this.testId).subscribe((response:MockTest) =>{
        console.log("Edit test: ", response)
        this.testQuestions = response.questions
        this.modifyMockTestForm.get('testName')?.setValue(response['testName'])
        this.modifyMockTestForm.get('testTakenBy')?.setValue(response['testTakenBy'])
        this.modifyMockTestForm.get('totalTime')?.setValue(response['totalTime'])
        this.modifyMockTestForm.get('totalNumberOfQuestions')?.setValue(response['totalNumberOfQuestions'])
        this.modifyMockTestForm.get('testType')?.setValue(response['testType'])
        this.modifyMockTestForm.get('testPrice')?.setValue(response['testPrice'])
        this.loading = false
        // Object.keys(this.modifyMockTestForm.controls).forEach(key =>{
        //   this.modifyMockTestForm.get(key)?.setValue(response['id'])
        // })
        // this.modifyMockTestForm.controls setValue(response)
      })
    })
  }

  modifyMockTest():void{
    this.loading = true;
    console.log("Modified test data: ", this.modifyMockTestForm.getRawValue())
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
    })

  }

  clearForm():void{

  }

  testTypeChanged(event: any){
    if(event['value']=='Free'){
      this.modifyMockTestForm.get('testPrice')?.setValue(0);
    }
  }

  updateQuestion(index: number, event: any){
    this.testQuestions[index].question = event.target.value

  }

  updateOption(questionIndex: number, optionIndex: number, event: any){
    this.testQuestions[questionIndex].options[optionIndex] = event.target.value
  }

  updateCorrectAnswer(index: number, event: any){
    this.testQuestions[index].correctAnswer = event.target.value
  }

}
