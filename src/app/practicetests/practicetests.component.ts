import { Component, Input, OnInit } from '@angular/core';
import { User } from '../interface/user';

@Component({
  selector: 'app-practicetests',
  templateUrl: './practicetests.component.html',
  styleUrls: ['./practicetests.component.css']
})
export class PracticetestsComponent implements OnInit {

  @Input() usersList! : User[];

  constructor() { }

  ngOnInit(): void {
  }

}
