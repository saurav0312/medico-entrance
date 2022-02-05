import { Component, OnInit } from '@angular/core';
import * as XLSX from 'xlsx';
import { MockTest } from '../../interface/mockTest';
import { Question } from '../../interface/question';
import { AuthService } from '../../service/auth.service';

@Component({
  selector: 'app-teacherdashboardcontent',
  templateUrl: './teacherdashboardcontent.component.html',
  styleUrls: ['./teacherdashboardcontent.component.scss']
})
export class TeacherdashboardcontentComponent implements OnInit {

  mockTest! : MockTest;
  mockTests! : MockTest[];

  constructor(
    private authService: AuthService 
  ) { }

  ngOnInit(): void {
  }

  uploadFile(event : any): void{
    console.log(event)
    const target: DataTransfer = <DataTransfer>(event.target)
    if(target.files.length !== 1){
      throw new Error("Cannot upload multiple files!")
    }

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


        let tempData =<MockTest> {"questions": questions};
        this.mockTest = tempData;
        console.log("MockTest Data: ", this.mockTest);

        this.authService.createMockTest(this.mockTest).then((ref) =>{
          console.log(ref)
        })
      })
    }

    reader.readAsBinaryString(target.files[0]);
  }


}
