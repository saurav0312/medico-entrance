import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { TestReportQuestion } from 'src/app/interface/testReportQuestion';

@Component({
  selector: 'app-individualquestion',
  templateUrl: './individualquestion.component.html',
  styleUrls: ['./individualquestion.component.css']
})
export class IndividualquestionComponent implements OnInit {

  question!: TestReportQuestion;
  hideQuestionExplanation = false;
  correctAnswerIndex: number = 0;

  constructor(
    private activatedRoute: ActivatedRoute,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  ngOnInit(): void {
    // this.activatedRoute.queryParams.subscribe(response =>{
    //   this.question =response['question'] as TestReportQuestion
    //   console.log("Individual Question: ", this.question);
    // })
    console.log("Individual test data: ", this.data);
    this.correctAnswerIndex = this.data.testReportQuestion.options.findIndex((option: any) => option === this.data.testReportQuestion.correctAnswer)
    console.log("Correct Answer index: ", this.correctAnswerIndex)
  }

}
