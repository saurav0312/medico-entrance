import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-question-answer-discussion',
  templateUrl: './question-answer-discussion.component.html',
  styleUrls: ['./question-answer-discussion.component.css']
})
export class QuestionAnswerDiscussionComponent implements OnInit {

  loading: boolean = false;

  constructor() { }

  ngOnInit(): void {
    this.loading = true;
    // let temp = 1000000000000000000;
    // while(temp !== 0){
    //   temp --;
    // }
    this.loading = false;
  }

}
