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

  subjectTagMap: {[key:string]:{[key:string]:number}} ={};
  topicTagMap: {[key:string]:{[key:string]:number}} ={};
  subjectTagPiechartData: any = []
  topicTagPiechartData: any = []

  subjectWiseTimeSpent = new Map();
  topicWiseTimeSpent = new Map();
  subjectWiseTimeSpentPiechartData: any = []
  topicWiseTimeSpentPiechartData: any = []

  expandCharts: boolean = false; 

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
          testQuestion.subjectTags?.forEach(subjectTag =>{
            this.subjectTagMap[subjectTag] ={'correct':0, 'incorrect':0,'not_answered':0}
          })

          testQuestion.topicTags?.forEach(topicTag =>{
            this.topicTagMap[topicTag] ={'correct':0, 'incorrect':0,'not_answered':0}
          })
        })

        console.log("Subject tag map: ", this.subjectTagMap)

        this.singleTest.testQuestions.forEach(testQuestion =>{
          if(testQuestion.selectedOption !== null){
            if(testQuestion.selectedOption === testQuestion.correctAnswer){
              //increase correct count for each subject type
              testQuestion.subjectTags?.forEach(subjectTag =>{
                //calculate time spent on each subject
                if(this.subjectWiseTimeSpent.has(subjectTag) == false){
                  this.subjectWiseTimeSpent.set(subjectTag,testQuestion.totalTimeSpent)
                }
                else{
                  this.subjectWiseTimeSpent.set(subjectTag, this.subjectWiseTimeSpent.get(subjectTag)+testQuestion.totalTimeSpent)
                }

                this.subjectTagMap[subjectTag]['correct'] = this.subjectTagMap[subjectTag]['correct'] === undefined ? 1 : this.subjectTagMap[subjectTag]['correct']+1
              })

              //increase correct count for each topic type
              testQuestion.topicTags?.forEach(topicTag =>{

                //calculate time spent on each topic
                if(this.topicWiseTimeSpent.has(topicTag) == false){
                  this.topicWiseTimeSpent.set(topicTag,testQuestion.totalTimeSpent)
                }
                else{
                  this.topicWiseTimeSpent.set(topicTag, this.topicWiseTimeSpent.get(topicTag)+testQuestion.totalTimeSpent)
                }

                this.topicTagMap[topicTag]['correct'] = this.topicTagMap[topicTag]['correct'] === undefined ? 1 : this.topicTagMap[topicTag]['correct']+1
              })
            }
            else{
              //increase incorrect count for each subject type
              testQuestion.subjectTags?.forEach(subjectTag =>{
                this.subjectTagMap[subjectTag]['incorrect'] = this.subjectTagMap[subjectTag]['incorrect'] === undefined ? 1 : this.subjectTagMap[subjectTag]['incorrect']+1
              })

              //increase incorrect count for each topic type
              testQuestion.topicTags?.forEach(topicTag =>{
                this.topicTagMap[topicTag]['incorrect'] = this.topicTagMap[topicTag]['incorrect'] === undefined ? 1 : this.topicTagMap[topicTag]['incorrect']+1
              })
            }
          }
          else{
            //increase not answered count for each topic type
            testQuestion.subjectTags?.forEach(subjectTag =>{
              this.subjectTagMap[subjectTag]['not_answered'] = this.subjectTagMap[subjectTag]['not_answered'] === undefined ? 1 : this.subjectTagMap[subjectTag]['not_answered']+1
            })

            //increase not answered count for each topic type
            testQuestion.topicTags?.forEach(topicTag =>{
              this.topicTagMap[topicTag]['not_answered'] = this.topicTagMap[topicTag]['not_answered'] === undefined ? 1 : this.topicTagMap[topicTag]['not_answered']+1
            })
          }
        })

        

        console.log("SubjectTag Map: ", this.subjectTagMap)
        console.log("TopicTag Map: ", this.topicTagMap)

        //prepare data for subject bar graph
        Object.keys(this.subjectTagMap).forEach(key =>{
          console.log("Each subject name: ", key)
          let temppiechartData = [];
          temppiechartData.push(key)
          temppiechartData.push(this.subjectTagMap[key]['correct'])
          temppiechartData.push(this.subjectTagMap[key]['incorrect'])
          temppiechartData.push(this.subjectTagMap[key]['not_answered'])
          this.subjectTagPiechartData.push(temppiechartData)
        })

        //prepare data for topic bar graph
        Object.keys(this.topicTagMap).forEach(key =>{
          console.log("Each subject name: ", key)
          let temppiechartData = [];
          temppiechartData.push(key)
          temppiechartData.push(this.topicTagMap[key]['correct'])
          temppiechartData.push(this.topicTagMap[key]['incorrect'])
          temppiechartData.push(this.topicTagMap[key]['not_answered'])
          this.topicTagPiechartData.push(temppiechartData)
        })

        for (let entry of this.subjectWiseTimeSpent.entries()) {
          console.log(entry[0], entry[1]);
          let temppiechartData = [];
          temppiechartData.push(entry[0]);
          temppiechartData.push(entry[1]);
          this.subjectWiseTimeSpentPiechartData.push(temppiechartData)
        }

        for (let entry of this.topicWiseTimeSpent.entries()) {
          console.log(entry[0], entry[1]);
          let temppiechartData = [];
          temppiechartData.push(entry[0]);
          temppiechartData.push(entry[1]);
          this.topicWiseTimeSpentPiechartData.push(temppiechartData)
        }


        this.buildChart(this.subjectTagPiechartData, this.topicTagPiechartData, this.subjectWiseTimeSpentPiechartData, this.topicWiseTimeSpentPiechartData )
      }
    })    
  }

  buildChart(subjectTagPiechartData : any, topicTagPiechartData: any, subjectWiseTimeSpentPiechartData:any ,topicWiseTimeSpentPiechartData:any){
    var renderChart = ()=>{

      // Create the data table for subjectwise time spent piechart.
      let subjectTimeSpentData = new google.visualization.DataTable();
      subjectTimeSpentData.addColumn('string', 'Subject');
      subjectTimeSpentData.addColumn('number', 'Total Time Spent');
      subjectTimeSpentData.addRows(subjectWiseTimeSpentPiechartData);

      let subjectTimeSpentOptions = {
        title: 'Time Spent on Subject',
        is3D: true,
        pieSliceText:'value',
        tooltip:{
          text:'value'
        }
      }

      //Create the data table for topicwise time spent piechart
      var topicTimeSpentData = new google.visualization.DataTable();
      topicTimeSpentData.addColumn('string', 'Topic');
      topicTimeSpentData.addColumn('number', 'Total Time Spent');
      topicTimeSpentData.addRows(topicWiseTimeSpentPiechartData);

      let topicTimeSpentOptions = {
        title: 'Time Spent on Topic',
        is3D: true,
        pieSliceText:'value',
        tooltip:{
          text:'value'
        }
      }


      var formatter = new google.visualization.NumberFormat({
        fractionDigits: 0,
        suffix: ' s'
      });

      formatter.format(subjectTimeSpentData, 1)
      formatter.format(topicTimeSpentData, 1)

      // Instantiate and draw pie chart, passing in some options.
      var subject_chart_div =  document.getElementById('subjectTimeSpent_chart_div');
      var subjectTagChart = () => new google.visualization.PieChart(subject_chart_div);
      var topicTagChart = () => new google.visualization.PieChart(document.getElementById('topicTimeSpent_chart_div'));

      subjectTagChart().draw(subjectTimeSpentData, subjectTimeSpentOptions);
      topicTagChart().draw(topicTimeSpentData, topicTimeSpentOptions);


      //Bar chart Subjectwise
      let subjectTagData = new google.visualization.DataTable();
      subjectTagData.addColumn('string', 'Subject');
      subjectTagData.addColumn('number', 'Correct');
      subjectTagData.addColumn('number', 'Incorrect');
      subjectTagData.addColumn('number', 'Not Answered');
      subjectTagData.addRows(subjectTagPiechartData);

      var options = {
        title : 'Test Analysis By Subject',
        vAxis: {title: 'No of questions',titleTextStyle: { color: 'black',
        fontSize: 15,
        bold: true,
        italic: false }},
        hAxis: {title: 'Subjects',titleTextStyle: { color: 'black',
        fontSize: 15,
        bold: true,
        italic: false }},
        seriesType: 'bars',
        fontSize: 13,
        bold: true,
        italic: true,
        series: {5: {type: 'line'}},
        
        isStacked: true
      };

     
      // var subjectwise_image_chart_div: any = document.getElementById('subjectwise_chart_div_png')
      var subjectChart = new google.visualization.ComboChart(document.getElementById('subjectwise_chart_div'));
       
      // Wait for the chart to finish drawing before calling the getImageURI() method.
      //  google.visualization.events.addListener(subjectChart, 'ready', function () {
      //   subjectwise_image_chart_div.outerHTML = '<a href="' + subjectChart.getImageURI() + '">Print</a>';
      //   console.log(subjectwise_image_chart_div.outerHTML);
      // });
      subjectChart.draw(subjectTagData, options);


      //Bar chart Topic Wise
      let topicTagData = new google.visualization.DataTable();
      topicTagData.addColumn('string', 'Subject');
      topicTagData.addColumn('number', 'Correct');
      topicTagData.addColumn('number', 'Incorrect');
      topicTagData.addColumn('number', 'Not Answered');
      topicTagData.addRows(topicTagPiechartData);

      var options1 = {
        title : 'Test Analysis By Topic',
        vAxis: {title: 'No of questions',titleTextStyle: { color: 'black',
        fontSize: 15,
        bold: true,
        italic: false }},
        hAxis: {title: 'Topics',titleTextStyle: { color: 'black',
        fontSize: 15,
        bold: true,
        italic: false }},
        seriesType: 'bars',
        fontSize: 13,
        bold: true,
        italic: true,
        series: {5: {type: 'line'}},
        
        isStacked: true
      };

      var topiChart = new google.visualization.ComboChart(document.getElementById('topicwise_chart_div'));
      topiChart.draw(topicTagData, options1);

      




    }
    // var subject_chart_div =  document.getElementById('subject_chart_div');
    // var subjectTagChart = () => new google.visualization.PieChart(subject_chart_div);
    // var topicTagChart = () => new google.visualization.PieChart(document.getElementById('topic_chart_div'));

    var callback = () =>renderChart()
    google.charts.setOnLoadCallback( callback);
    window.onresize = ()=>{
        callback()
    };
  }

  ngAfterViewInit(): void {
    this.dataSource.data = this.testToShowInTable.testQuestions
    this.dataSource.paginator = this.paginator;
    console.log("Questions",this.testToShowInTable.testQuestions)
    console.log(this.dataSource.data);
  } 
}
