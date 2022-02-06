import { Component, Input, OnInit } from '@angular/core';
import { User } from '../../interface/user';
import { MockTest } from '../../interface/mockTest';
import { Question } from '../../interface/question';
import { Firestore, collectionData, collection } from '@angular/fire/firestore';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../../service/auth.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-practicetests',
  templateUrl: './practicetests.component.html',
  styleUrls: ['./practicetests.component.css']
})
export class PracticetestsComponent implements OnInit {

  //mockTests! : MockTest[];
  testIdList: Array<string>=[];
  noOfTests!: number;
  testType!: string;

  loading: boolean = false;

  @Input() listOfMockTests : MockTest[] = [];

  constructor(
    private firestore: Firestore,
    private httpClient : HttpClient,
    private authService: AuthService,
    private router : Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.loading = true;
    this.route.queryParams.subscribe((params: any)=>{
      this.testType = <string>params.testType;
      this.authService.readMockTest(this.testType).subscribe((response: MockTest[]) =>{
        this.loading = false;
        this.listOfMockTests = response
        console.log("Collection of MockTests: ", response)
    })
    })

    

  //   this.authService.readMockTest().subscribe((response: any) =>{
  //     this.mockTests = response
  //     //this.collec = JSON.stringify(this.mockTests)
  //     console.log("Collection of MockTests: ", response)
  // })
  }

  startTest(testId: string | undefined) : void{
    this.router.navigate(["/practicetest/testInstructions"], {queryParams: {data: testId}})
  }

}
