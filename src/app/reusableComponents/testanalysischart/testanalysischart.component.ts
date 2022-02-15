import { Component, Input, OnInit } from '@angular/core';
import { GoogleChartInterface } from 'ng2-google-charts';

@Component({
  selector: 'app-testanalysischart',
  templateUrl: './testanalysischart.component.html',
  styleUrls: ['./testanalysischart.component.css']
})
export class TestanalysischartComponent implements OnInit {

  _piechart!: GoogleChartInterface;

  constructor() { }

  ngOnInit(): void {
  }

  @Input()
  set piechart(piechart: GoogleChartInterface){
    this._piechart = piechart
  }

  get piechart(): GoogleChartInterface{
    return this._piechart
  }
}
