import { Component, Input, OnInit } from '@angular/core';
import { MockTest } from '../interface/mockTest';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../service/auth.service';

@Component({
  selector: 'app-starttest',
  templateUrl: './starttest.component.html',
  styleUrls: ['./starttest.component.css']
})
export class StarttestComponent implements OnInit {

  @Input() testId!: string;
  testData!: MockTest;
  counter = 0;

  constructor(
    private router : Router,
    private route: ActivatedRoute,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    this.route.queryParams.subscribe((params: any) =>{
      this.testId = <string>params.data
      this.authService.getMockTestByID(this.testId).subscribe(response=>{
        this.testData= response;
      })
      console.log("Query data", this.testId)
    })
  }

  increaseCounter(): void{
    this.counter++;
    if(this.counter === this.testData.questions.length ){
      this.counter = this.testData.questions.length-1;
    }
  }

  decreaseCounter(): void{
    this.counter --;
    if(this.counter === -1){
      this.counter = 0;
    }
  }

  changeQuestion(questionIndex: number): void{
    this.counter = questionIndex
  }
}
