import { AfterViewInit, Component, ElementRef, OnInit, TemplateRef, ViewChild } from '@angular/core';
import * as XLSX from 'xlsx';
import { MockTest } from '../../interface/mockTest';
import { Question } from '../../interface/question';
import { AuthService } from '../../service/auth.service';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { ProgressSpinnerMode } from '@angular/material/progress-spinner';
import { ToastrService } from 'ngx-toastr';
import { ProfileService } from 'src/app/service/profile.service';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { from, switchMap, Observable } from 'rxjs';

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
  testQuestionImagesFile!: DataTransfer;
  zipFileContent!: any;

  userId!: string | undefined;

  @ViewChild('testNameTemplate', {static: true} ) testNameTemplate! : TemplateRef<ElementRef>;
  @ViewChild('testTakerTemplate',{static: true} ) testTakerTemplate! : TemplateRef<ElementRef>;
  @ViewChild('totalTimeTemplate', {static: true} ) totalTimeTemplate! : TemplateRef<ElementRef>;
  @ViewChild('totalNoOfQuestionTemplate', {static: true} ) totalNoOfQuestionTemplate! : TemplateRef<ElementRef>;
  @ViewChild('testTypeTemplate', {static: true} ) testTypeTemplate! : TemplateRef<ElementRef>;
  @ViewChild('testPriceTemplate',{static: true} ) testPriceTemplate! : TemplateRef<ElementRef>;
  @ViewChild('testCategoryTemplate', {static: true} ) testCategoryTemplate! : TemplateRef<ElementRef>;
  @ViewChild('excelFileTemplate', {static: true} ) excelFileTemplate! : TemplateRef<ElementRef>;
  @ViewChild('testQuestionsZipTemplate', {static: true} ) testQuestionsZipTemplate! : TemplateRef<ElementRef>;
  @ViewChild('saveCancelTemplate',{static: true} ) saveCancelTemplate! : TemplateRef<ElementRef>;

  templateNameList : Array<string[]> =[
          ['testNameTemplate','testTakerTemplate'],
          ['totalTimeTemplate', 'totalNoOfQuestionTemplate'],
          ['testTypeTemplate'], ['testPriceTemplate'],
          ['testCategoryTemplate'], ['excelFileTemplate'],
          ['testQuestionsZipTemplate'], ['saveCancelTemplate']
          ]

  templateRefList: any;

  constructor(
    private authService: AuthService,
    private toastrService: ToastrService,
    private profileService: ProfileService,
    private http: HttpClient
  ) { }

  ngOnInit(): void {

    this.templateRefList = {
                            'testNameTemplate': this.testNameTemplate, 'testTakerTemplate': this.testTakerTemplate,
                            'totalTimeTemplate': this.totalTimeTemplate, 'totalNoOfQuestionTemplate': this.totalNoOfQuestionTemplate,
                            'testTypeTemplate': this.testTypeTemplate, 'testPriceTemplate': this.testPriceTemplate,
                            'testCategoryTemplate': this.testCategoryTemplate, 'excelFileTemplate': this.excelFileTemplate,
                            'testQuestionsZipTemplate': this.testQuestionsZipTemplate, 'saveCancelTemplate': this.saveCancelTemplate
                            }

    this.createMockTestForm = new FormGroup(
      {
        testName: new FormControl('',[Validators.required]),
        testTakenBy: new FormControl('',[Validators.required]),
        totalTime : new FormControl('', [Validators.required, Validators.min(1)]),
        totalNumberOfQuestions: new FormControl('', [Validators.required]),
        testType: new FormControl('', [Validators.required]),
        testCategory: new FormControl('',[Validators.required]),
        subjectField: new FormControl(''),
        topicField: new FormControl(''),
        testSourceFile: new FormControl('' ,[Validators.required]),
        testPrice: new FormControl(''),
        testQuestionImagesFile: new FormControl('')
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
    if(event.target.files.length !== 1){
      throw new Error("Cannot upload multiple files!")
    }

    this.testSourceFile = <DataTransfer>(event.target)
  }

  uploadQuestionImagesFile(event : any): void{

    if(event.target.files.length !== 1){
      throw new Error("Cannot upload multiple zip files!")
    }

    this.testQuestionImagesFile = <DataTransfer>(event.target)

    var reader = new FileReader();
    reader.readAsArrayBuffer(this.testQuestionImagesFile.files[0])

    reader.onload = (event) =>{
      const jsZip = require('jszip');
      jsZip.loadAsync(event.target?.result).then((zip: any) =>{
        this.zipFileContent = zip
      })
    }
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
          let questionImageList: Array<string> = [];
          let firebaseQuestionImageList: Array<string> = []; 

          data.forEach((questionItem:any) =>{
            let options: Array<any> =[];
            options.push(questionItem.optionA)
            options.push(questionItem.optionB)
            options.push(questionItem.optionC)
            options.push(questionItem.optionD)

            
            let subjectTags: Array<string> = questionItem.subject_tag.split("|")

            let topicTags:Array<string> = questionItem.topic_tag.split("|")
  
            let question:Question = {
              "question":questionItem.question,
              "options":options,
              "correctAnswer":questionItem.correctAnswer,
              "subjectTags": subjectTags,
              "topicTags": topicTags,
              "answerExplanation": questionItem.answerExplanation,
              "totalTimeSpent":0,
              "questionImageUrl":[]
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
            let tempData;
            if(this.createMockTestForm.get('testCategory')?.value === 'Subject'){
              tempData =<MockTest> {
                "testName": this.createMockTestForm.get('testName')?.value,
                "testTakenBy": this.createMockTestForm.get('testTakenBy')?.value,
                "totalTime": this.createMockTestForm.get('totalTime')?.value,
                "totalNumberOfQuestions": this.createMockTestForm.get('totalNumberOfQuestions')?.value,
                "testType": this.createMockTestForm.get('testType')?.value,
                "testCategory": this.createMockTestForm.get('testCategory')?.value,
                "subjectName": this.createMockTestForm.get('subjectField')?.value,
                "topicName": this.createMockTestForm.get('topicField')?.value,
                "questions": questions,
                "testPrice": this.createMockTestForm.get('testPrice')?.value,
                "teacherUserId": this.userId,
                "testUploadDate": new Date()
              };
            }
            else{
              tempData =<MockTest> {
                "testName": this.createMockTestForm.get('testName')?.value,
                "testTakenBy": this.createMockTestForm.get('testTakenBy')?.value,
                "totalTime": this.createMockTestForm.get('totalTime')?.value,
                "totalNumberOfQuestions": this.createMockTestForm.get('totalNumberOfQuestions')?.value,
                "testType": this.createMockTestForm.get('testType')?.value,
                "testCategory": this.createMockTestForm.get('testCategory')?.value,
                "subjectName": this.createMockTestForm.get('subjectField')?.value,
                "topicName": this.createMockTestForm.get('topicField')?.value,
                "questions": questions,
                "testPrice": this.createMockTestForm.get('testPrice')?.value,
                "teacherUserId": this.userId,
                "testUploadDate": new Date()
              };
            }
            this.mockTest = tempData;
    
            //create mock test
            this.authService.createMockTest(this.mockTest).then((ref) =>{

              //upload each question image to firebase storage and maintain map of the image id
              let subss = this.authService.getCurrentUser().subscribe(userDetail =>{
                if(userDetail !== null){
                  subss.unsubscribe()
                  let sub = this.authService.getMockTestByID(ref.id).subscribe(response =>{
                    let createdMockTest: MockTest = response
                    sub.unsubscribe()

                    let allImageList:Array<string> = []
                    if(this.zipFileContent !== undefined){
                      Object.keys(this.zipFileContent.files).forEach((filename) =>{
                        if(this.zipFileContent.files[filename].dir === false){
                          allImageList.push(filename)
                        }
                      })

                      console.log("All image files: ", allImageList)
                      let questionNumberToImageMap : {[key: string]: Array<string>} ={};

                      allImageList.forEach((filename,i) =>{
                        let filenameContentsArray = filename.split('/')
                        let questionNumber = (parseInt(filenameContentsArray[1])-1).toString()
                        

                        if(questionNumberToImageMap[questionNumber]!== undefined){
                          questionNumberToImageMap[questionNumber].push(filenameContentsArray[2])
                        }
                        else{
                          questionNumberToImageMap[questionNumber] = [];
                          questionNumberToImageMap[questionNumber].push(filenameContentsArray[2])
                        }
                      })

                      console.log("Question number to ImageList: ", questionNumberToImageMap)
                      let imagesUploadedCount= 0;

                      let totalNoOfQuestions = Object.keys(questionNumberToImageMap).length

                      Object.keys(questionNumberToImageMap).forEach((questionNumber,i) =>{
                        imagesUploadedCount+=1
                        console.log("Question Number: ", questionNumber)
                        console.log("Imagesuploaded count: ", imagesUploadedCount)
                        questionNumberToImageMap[questionNumber].forEach(questionImage =>{
                          this.zipFileContent.files['QuestionImages/'+(parseInt(questionNumber)+1).toString() +'/'+questionImage].async('arraybuffer').then((fileData:Uint8Array) =>{
  
                            let subs = this.profileService.uploadQuestionImage(fileData,questionImage,userDetail.uid,ref.id, questionNumber).subscribe(imageUrl =>{
                              console.log("Image uploaded: ", imageUrl)
                              subs.unsubscribe()
                              
                              createdMockTest.questions[parseInt(questionNumber)].questionImageUrl?.push(imageUrl)
                              console.log("Updated mocktest with image url: ", createdMockTest)
                              if(imagesUploadedCount == totalNoOfQuestions){
                                console.log("entered")
                                console.log("Final Updated mocktest with image url: ", createdMockTest)
                                this.authService.updateMockTestDetails(ref.id, createdMockTest).subscribe(response =>{
                                  console.log("test updated in db: ", response)
                                })
                              }
                              
                            })
                          })
                        })
                      })

                      console.log("Updated Mock Test: ", createdMockTest)
                    }
                  })
                }
              })
              
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
    this.createMockTestForm.reset();
    this.ngOnInit();

  }

  testTypeChanged(event: any){
    if(event['value']=='Free'){
      this.createMockTestForm.get('testPrice')?.setValue(0);
    }
  }

  testCategoryChanged(event: any){
    if(event['value'] ==='Mock')
    {
      this.createMockTestForm.get('subjectField')?.setValue('sample');
      this.createMockTestForm.get('topicField')?.setValue('sample');
    }
    else{
      this.createMockTestForm.get('subjectField')?.setValue('sample');
      this.createMockTestForm.get('topicField')?.setValue('sample');
    }
  }


}
