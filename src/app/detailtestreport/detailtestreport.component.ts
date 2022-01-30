import { Component, OnInit, ViewChild, AfterViewInit, Input, ElementRef } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { TestReportQuestion } from '../interface/testReportQuestion';
import { Tests } from '../interface/tests';
import { jsPDF } from "jspdf"; 

@Component({
  selector: 'app-detailtestreport',
  templateUrl: './detailtestreport.component.html',
  styleUrls: ['./detailtestreport.component.css']
})
export class DetailtestreportComponent implements OnInit, AfterViewInit {

  @Input() displayedColumns!: string[];
  @Input() testToShowInTable! : Tests;

  dataSource: MatTableDataSource<TestReportQuestion> = new MatTableDataSource();

  @ViewChild(MatPaginator) paginator! : MatPaginator;
  @ViewChild('content') content!: ElementRef;

  constructor() { }

  ngOnInit(): void {
    
  }

  ngAfterViewInit(): void {
    this.dataSource.data = this.testToShowInTable.testQuestions
    this.dataSource.paginator = this.paginator;
    console.log("Questions",this.testToShowInTable.testQuestions)
    console.log(this.dataSource.data);
  } 
}
