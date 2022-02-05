import { Component, OnInit, ViewChild, AfterViewInit, Input, ElementRef } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { TestReportQuestion } from '../../interface/testReportQuestion';
import { Tests } from '../../interface/tests'; 
import { ActivatedRoute } from '@angular/router';
import { SharedService } from 'src/app/service/shared.service';
import { Timestamp } from 'firebase/firestore';

@Component({
  selector: 'app-detailtestreport',
  templateUrl: './detailtestreport.component.html',
  styleUrls: ['./detailtestreport.component.css']
})
export class DetailtestreportComponent implements OnInit, AfterViewInit {

  testId!: string;
  testTakenDate! : Date | undefined;

  @Input() displayedColumns!: string[];
  @Input() testToShowInTable! : Tests;

  dataSource: MatTableDataSource<TestReportQuestion> = new MatTableDataSource();

  @ViewChild(MatPaginator) paginator! : MatPaginator;
  @ViewChild('content') content!: ElementRef;

  constructor(
    private activatedRoute: ActivatedRoute,
    private sharedService: SharedService,
  ) { }

  ngOnInit(): void {
    this.displayedColumns = this.sharedService.displayedColumns
    this.testToShowInTable = this.sharedService.testData
    this.testId = this.testToShowInTable.testId;
    this.testTakenDate = (<Timestamp><unknown>this.testToShowInTable.testTakenDate).toDate()
  }

  ngAfterViewInit(): void {
    this.dataSource.data = this.testToShowInTable.testQuestions
    this.dataSource.paginator = this.paginator;
    console.log("Questions",this.testToShowInTable.testQuestions)
    console.log(this.dataSource.data);
  } 
}
