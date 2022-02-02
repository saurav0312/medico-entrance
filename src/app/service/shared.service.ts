import { Injectable } from '@angular/core';
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
}
