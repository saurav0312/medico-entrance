import { Component, Input, OnInit } from '@angular/core';
import { User } from '../interface/user';
import { MockTest } from '../interface/mockTest';
import { Question } from '../interface/question';
import { Firestore, collectionData, collection } from '@angular/fire/firestore';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-practicetests',
  templateUrl: './practicetests.component.html',
  styleUrls: ['./practicetests.component.css']
})
export class PracticetestsComponent implements OnInit {

  @Input() listOfMockTests! : MockTest[];

  constructor(
    private firestore: Firestore,
    private httpClient : HttpClient,
  ) { }

  ngOnInit(): void {

    this.httpClient.get("/src/assests/mockTests.json").subscribe(response =>{
      console.log(response)
    })


    // const collectionList = collection(this.firestore, 'MockTests');
    //   collectionData(collectionList).subscribe((response: any) =>{
    //     this.listOfMockTests = response
    //     console.log("Collection: ", response)
    // })
  }

}
