import { Component, OnInit } from '@angular/core';
import * as XLSX from 'xlsx';
import { MockTest } from '../../interface/mockTest';
import { Question } from '../../interface/question';
import { AuthService } from '../../service/auth.service';

@Component({
  selector: 'app-studentdashboardcontent',
  templateUrl: './studentdashboardcontent.component.html',
  styleUrls: ['./studentdashboardcontent.component.scss']
})
export class StudentdashboardcontentComponent implements OnInit {

  mockTest! : MockTest;
  mockTests! : MockTest[];

  constructor(
    private authService: AuthService 
    ) { }

  ngOnInit(): void {
  }
}
