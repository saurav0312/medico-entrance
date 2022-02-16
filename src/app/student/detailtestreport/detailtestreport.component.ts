import { Component, OnInit, ViewChild, AfterViewInit, Input, ElementRef } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { TestReportQuestion } from '../../interface/testReportQuestion';
import { Tests } from '../../interface/tests'; 
import { ActivatedRoute } from '@angular/router';
import { SharedService } from 'src/app/service/shared.service';
import { Timestamp } from 'firebase/firestore';
import { AuthService } from 'src/app/service/auth.service';
import { animate, state, style, transition, trigger } from '@angular/animations';

declare var google: any;

@Component({
  selector: 'app-detailtestreport',
  templateUrl: './detailtestreport.component.html',
  styleUrls: ['./detailtestreport.component.css'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({height: '0px', minHeight: '0'})),
      state('expanded', style({height: '*'})),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class DetailtestreportComponent implements OnInit, AfterViewInit {

  expandedElement!: TestReportQuestion | null;

  testId!: string;
  testTakenDate! : Date;
  singleTest!: Tests | undefined;

  subjectTagMap = new Map();
  topicTagMap = new Map();

  subjectTagPiechartData: any = []
  topicTagPiechartData: any = []

  @Input() displayedColumns!: string[];
  @Input() testToShowInTable! : Tests;

  private _dataSource : MatTableDataSource<TestReportQuestion> = new MatTableDataSource();

  @Input()
  set dataSource(dataSourceVal : MatTableDataSource< TestReportQuestion> ){
    this._dataSource = dataSourceVal;
  }

  get dataSource (): MatTableDataSource< TestReportQuestion>{
    return this._dataSource
  }

  @ViewChild(MatPaginator) paginator! : MatPaginator;
  @ViewChild('content') content!: ElementRef;

  constructor(
    private activatedRoute: ActivatedRoute,
    private sharedService: SharedService,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    google.charts.load('current', {packages: ['corechart']});

    this.activatedRoute.queryParams.subscribe(response =>{
      this.displayedColumns = <string[]>response['displayedColumns']
      this.testToShowInTable = JSON.parse(response['testData']) as Tests
      console.log("Query param response: ",response)
      console.log("test to show in table: ", this.testToShowInTable)
      this.testId = this.testToShowInTable.testId;
      console.log("Date from db: ", this.testToShowInTable.testTakenDate)
      //this.testTakenDate = new Date(this.testToShowInTable.testTakenDate).toDateString()
      if(this.testToShowInTable.testTakenDate !== undefined){
        const dateValue = <Timestamp><unknown>this.testToShowInTable.testTakenDate
        this.testTakenDate = new Date(dateValue['seconds']*1000)
      }
      console.log("Date: ", this.testTakenDate)

      this.singleTest = this.testToShowInTable
      console.log("Single test: ",this.singleTest)
      if(this.singleTest !== undefined){
        
        this.singleTest.testQuestions.forEach(testQuestion =>{
          if(testQuestion.selectedOption !== null && testQuestion.selectedOption === testQuestion.correctAnswer){
            testQuestion.subjectTags?.forEach(subjectTag =>{
              if(this.subjectTagMap.has(subjectTag) == false){
                this.subjectTagMap.set(subjectTag,1)
              }
              else{
                this.subjectTagMap.set(subjectTag, this.subjectTagMap.get(subjectTag)+1)
              }
            })

            //counting correct questions based on topic tags
            testQuestion.topicTags?.forEach(topicTag =>{
              if(this.topicTagMap.has(topicTag) == false){
                this.topicTagMap.set(topicTag,1)
              }
              else{
                this.topicTagMap.set(topicTag, this.topicTagMap.get(topicTag)+1)
              }
            })
          }
        })

        

        console.log("SubjectTag Map: ", this.subjectTagMap)
        console.log("TopicTag Map: ", this.topicTagMap)

        for (let entry of this.subjectTagMap.entries()) {
          console.log(entry[0], entry[1]);
          let temppiechartData = [];
          temppiechartData.push(entry[0]);
          temppiechartData.push(entry[1]);
          this.subjectTagPiechartData.push(temppiechartData)
        }

        for (let entry of this.topicTagMap.entries()) {
          console.log(entry[0], entry[1]);
          let temppiechartData = [];
          temppiechartData.push(entry[0]);
          temppiechartData.push(entry[1]);
          this.topicTagPiechartData.push(temppiechartData)
        }
        this.buildChart(this.subjectTagPiechartData, this.topicTagPiechartData)
      }
    })    
  }

  buildChart(subjectTagPiechartData : any, topicTagPiechartData: any){
    var renderChart = (subjectTagChart: any, topicTagChart: any )=>{

      // Create the data table.
      let subjectTagData = new google.visualization.DataTable();
      subjectTagData.addColumn('string', 'Question Category');
      subjectTagData.addColumn('number', 'No of Correct Questions Answered');
      subjectTagData.addRows(subjectTagPiechartData);

      let subjectTagOptions = {
        title: 'Test Analysis Based on Subject',
        is3D: true,
      }

      var topicTagData = new google.visualization.DataTable();
      topicTagData.addColumn('string', 'Question Category');
      topicTagData.addColumn('number', 'No of Correct Questions Answered');
      topicTagData.addRows(topicTagPiechartData);

      let topicTagOptions = {
        title: 'Test Analysis Based on Topic',
        is3D: true,
      }

      // Instantiate and draw our chart, passing in some options.
      subjectTagChart().draw(subjectTagData, subjectTagOptions);
      topicTagChart().draw(topicTagData, topicTagOptions);

    }
    var subject_chart_div =  document.getElementById('subject_chart_div');
    var subjectTagChart = () => new google.visualization.PieChart(subject_chart_div);
    var topicTagChart = () => new google.visualization.PieChart(document.getElementById('topic_chart_div'));

    var callback = () =>renderChart(subjectTagChart, topicTagChart)
    google.charts.setOnLoadCallback( callback);
  }

  ngAfterViewInit(): void {
    this.dataSource.data = this.testToShowInTable.testQuestions
    this.dataSource.paginator = this.paginator;
    console.log("Questions",this.testToShowInTable.testQuestions)
    console.log(this.dataSource.data);
  } 
}
