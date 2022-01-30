import { Component, Input, OnInit } from '@angular/core';
import { User } from '../interface/user';
import { MockTest } from '../interface/mockTest';
import { Question } from '../interface/question';
import { Firestore, collectionData, collection } from '@angular/fire/firestore';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../service/auth.service';
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

  @Input() listOfMockTests! : MockTest[];

  constructor(
    private firestore: Firestore,
    private httpClient : HttpClient,
    private authService: AuthService,
    private router : Router
  ) { }

  ngOnInit(): void {

    this.authService.mock$.subscribe((response: any) =>{
      //this.mockTests = response
      //this.collec = JSON.stringify(this.mockTests)
      this.noOfTests = response.length
      response.forEach((element:any) => {
        this.testIdList.push(element.id)
        console.log(this.testIdList)
      });
      

      console.log("Collection of MockTests: ", response)
  })

  //   this.authService.readMockTest().subscribe((response: any) =>{
  //     this.mockTests = response
  //     //this.collec = JSON.stringify(this.mockTests)
  //     console.log("Collection of MockTests: ", response)
  // })
  }

  startTest(testId: string) : void{
    this.router.navigate(["/testInstructions"], {queryParams: {data: testId}})
  }

}
