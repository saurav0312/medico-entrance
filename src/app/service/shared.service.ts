import { Injectable } from '@angular/core';
import { MockTest } from '../interface/mockTest';
import { Tests } from '../interface/tests';

@Injectable({
  providedIn: 'root'
})
export class SharedService {

  private _displayedColumns!: string[];
  private _testData!: Tests;


  get displayedColumns(): string[]{
    return this._displayedColumns;
  }

  set displayedColumns(cols : string[]){
    this._displayedColumns = cols;
  }

  get testData(): Tests{
    return this._testData;
  }

  set testData(testDataInput : Tests){
    this._testData = testDataInput;
  }


  constructor() { }

  sortData(listOfMockTests : MockTest[]): MockTest[]{
    listOfMockTests.sort((x,y) =>{

      if(x.testType === 'Free' && y.testType === 'Free'){
        return 0
      }
      if(x.testType === 'Paid' && y.testType === 'Paid'){
        return x.isBought === y.isBought ? 0 : x.isBought ? -1 : 1
      }
      return x.testType ==='Free' ? -1 : 1
    })
    return listOfMockTests;
  }
}
