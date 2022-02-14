import { AfterViewInit, Component, OnInit } from '@angular/core';
import * as XLSX from 'xlsx';
import { MockTest } from '../../interface/mockTest';
import { Question } from '../../interface/question';
import { AuthService } from '../../service/auth.service';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { ProgressSpinnerMode } from '@angular/material/progress-spinner';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-addmocktest',
  templateUrl: './addmocktest.component.html',
  styleUrls: ['./addmocktest.component.scss']
})
export class AddmocktestComponent implements OnInit{

  mockTest! : MockTest;
  mockTests! : MockTest[];

  //For spinner
  mode: ProgressSpinnerMode  = "indeterminate";
  loading : boolean = false;

  createMockTestForm!: FormGroup;
  testSourceFile! : DataTransfer;

  userId!: string | undefined;

  constructor(
    private authService: AuthService,
    private toastrService: ToastrService
  ) { }

  ngOnInit(): void {
    this.createMockTestForm = new FormGroup(
      {
        testName: new FormControl('',[Validators.required]),
        testTakenBy: new FormControl('',[Validators.required]),
        totalTime : new FormControl('', [Validators.required, Validators.min(1)]),
        totalNumberOfQuestions: new FormControl('', [Validators.required]),
        testType: new FormControl('', [Validators.required]),
        testSourceFile: new FormControl('' ,[Validators.required]),
        testPrice: new FormControl('')
      }
    );

    let sub = this.authService.getCurrentUser().subscribe(response =>{
      if(response !== null){
        this.userId = response?.uid
        sub.unsubscribe()
      }
    })
  }

  uploadFile(event : any): void{
    console.log(event)
    if(event.target.files.length !== 1){
      throw new Error("Cannot upload multiple files!")
    }

    this.testSourceFile = <DataTransfer>(event.target)
    console.log("FormData:",this.createMockTestForm)
  }

  createMockTest(){
    this.loading = true;
    const reader: FileReader = new FileReader();

    reader.onload = (event) =>{
      console.log(event)
      let binaryData = event.target?.result
      let workBook = XLSX.read(binaryData,{type:'binary'})
      console.log(workBook)

      workBook.SheetNames.forEach(sheet =>{
        const data = XLSX.utils.sheet_to_json(workBook.Sheets[sheet]);
        let questions: Question[] = [];
        console.log(data)

        if(data.length == 0){
          this.loading = false;
          this.createMockTestForm.get('testSourceFile')?.setErrors({notEmpty: false})
          this.toastrService.error("Can not upload empty question list!")
        }
        else{
          let checkPassed = true;
          data.forEach((questionItem:any) =>{
            let options: Array<any> =[];
            options.push(questionItem.optionA)
            options.push(questionItem.optionB)
            options.push(questionItem.optionC)
            options.push(questionItem.optionD)
  
            let question:Question = {
              "question":questionItem.question,
              "options":options,
              "correctAnswer":questionItem.correctAnswer
            }
            questions.push(question);
          })

          questions.forEach(question =>{
            if(question.options.findIndex(ele => ele === question.correctAnswer) === -1){
              this.toastrService.error("Correct answer should match one of the options.")
              checkPassed = false;
              this.loading = false;
            }
          })
  
          if(checkPassed == true){
            let tempData =<MockTest> {
              "testName": this.createMockTestForm.get('testName')?.value,
              "testTakenBy": this.createMockTestForm.get('testTakenBy')?.value,
              "totalTime": this.createMockTestForm.get('totalTime')?.value,
              "totalNumberOfQuestions": this.createMockTestForm.get('totalNumberOfQuestions')?.value,
              "testType": this.createMockTestForm.get('testType')?.value,
              "questions": questions,
              "testPrice": this.createMockTestForm.get('testPrice')?.value,
              "teacherUserId": this.userId
            };
            this.mockTest = tempData;
            console.log("MockTest Data: ", this.mockTest);
    
            this.authService.createMockTest(this.mockTest).then((ref) =>{
              this.loading = false;
              this.toastrService.success("Test created successfully");
              this.createMockTestForm.reset('')
              this.ngOnInit();
              console.log(ref)
            }) 
          }
        }
      })
    }

    if(this.testSourceFile !== null){
      reader.readAsBinaryString(this.testSourceFile.files[0]);
    }
  }

  clearForm() : void{
    // console.log("Cancel clicked")
    // console.log(this.createMockTestForm)
    this.createMockTestForm.reset();
    this.ngOnInit();

  }

  testTypeChanged(event: any){
    if(event['value']=='Free'){
      this.createMockTestForm.get('testPrice')?.setValue(0);
    }
  }


}
