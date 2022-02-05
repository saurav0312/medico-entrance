import { Component, Input, OnInit } from '@angular/core';
import { ProgressSpinnerMode } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-spinner',
  templateUrl: './spinner.component.html',
  styleUrls: ['./spinner.component.css']
})
export class SpinnerComponent implements OnInit {

  @Input() loading : boolean = false;
  @Input() mode: ProgressSpinnerMode  = "indeterminate";
  @Input() diameter: number = 50;
  @Input() overlay: boolean = true;

  constructor() { }

  ngOnInit(): void {
  }

}
