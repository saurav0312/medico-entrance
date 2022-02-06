import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-testinstructions',
  templateUrl: './testinstructions.component.html',
  styleUrls: ['./testinstructions.component.css']
})
export class TestinstructionsComponent implements OnInit {

  @Input() testNumber! : number;
  @Input() testId! : string;
  @Input() testType!: string;

  constructor(
    private router : Router,
    private route: ActivatedRoute,
  ) { }

  ngOnInit(): void {
    this.route.queryParams.subscribe((params: any) =>{
      this.testId = <string>params.data
      this.testType = <string>params.testType;
    })
  }

  startTest() : void{
    this.router.navigate(["/practicetest/startTest"], {queryParams: {data: this.testId}})
  }

}
