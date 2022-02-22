import { Component, OnInit, ViewChild, AfterViewInit, Input, ElementRef } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { TestReportQuestion } from '../../interface/testReportQuestion';
import { Tests } from '../../interface/tests'; 
import { ActivatedRoute, Router } from '@angular/router';
import { SharedService } from 'src/app/service/shared.service';
import { Timestamp } from 'firebase/firestore';
import { AuthService } from 'src/app/service/auth.service';
import { animate, state, style, transition, trigger } from '@angular/animations';
import screenfull from 'screenfull';
import { MatDialog } from '@angular/material/dialog';
import { IndividualquestionComponent } from '../individualquestion/individualquestion.component';


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
  subjectTagBarGraphData: any = []
  topicTagBarGraphData: any = []

  subjectWiseTimeSpent = new Map();
  topicWiseTimeSpent = new Map();
  subjectWiseTimeSpentPiechartData: any = []
  topicWiseTimeSpentPiechartData: any = []

  expandCharts: boolean = true; 
  expandTable: boolean = true;
  count: number = 0;
  totalScore : number = 0;

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
    private authService: AuthService,
    private router: Router,
    private dialog: MatDialog,
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

          //calculate time spent on the question based on subject
          testQuestion.subjectTags?.forEach(subjectTag =>{
            if(this.subjectWiseTimeSpent.has(subjectTag) == false){
              this.subjectWiseTimeSpent.set(subjectTag,testQuestion.totalTimeSpent)
            }
            else{
              this.subjectWiseTimeSpent.set(subjectTag, this.subjectWiseTimeSpent.get(subjectTag)+testQuestion.totalTimeSpent)
            }
          })

          //calculate time spent on the question based on topic
          testQuestion.topicTags?.forEach(topicTag =>{
            if(this.topicWiseTimeSpent.has(topicTag) == false){
              this.topicWiseTimeSpent.set(topicTag,testQuestion.totalTimeSpent)
            }
            else{
              this.topicWiseTimeSpent.set(topicTag, this.topicWiseTimeSpent.get(topicTag)+testQuestion.totalTimeSpent)
            }
          })


          if(testQuestion.selectedOption !== null){
            if(testQuestion.selectedOption === testQuestion.correctAnswer){
              this.totalScore += 1;

              //increase correct count for each subject type
              testQuestion.subjectTags?.forEach(subjectTag =>{
                this.subjectTagMap[subjectTag]['correct'] = this.subjectTagMap[subjectTag]['correct'] === undefined ? 1 : this.subjectTagMap[subjectTag]['correct']+1
              })

              //increase correct count for each topic type
              testQuestion.topicTags?.forEach(topicTag =>{
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
          this.subjectTagBarGraphData.push(temppiechartData)
        })

        //prepare data for topic bar graph
        Object.keys(this.topicTagMap).forEach(key =>{
          console.log("Each subject name: ", key)
          let temppiechartData = [];
          temppiechartData.push(key)
          temppiechartData.push(this.topicTagMap[key]['correct'])
          temppiechartData.push(this.topicTagMap[key]['incorrect'])
          temppiechartData.push(this.topicTagMap[key]['not_answered'])
          this.topicTagBarGraphData.push(temppiechartData)
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


        // this.buildChart(this.subjectTagBarGraphData, this.topicTagBarGraphData, this.subjectWiseTimeSpentPiechartData, this.topicWiseTimeSpentPiechartData )
      }
    })    
  }

  buildChart(subjectTagBarGraphData : any, topicTagBarGraphData: any, subjectWiseTimeSpentPiechartData:any ,topicWiseTimeSpentPiechartData:any){
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
      var subjectTimeSpent_chart_download_button: any=  document.getElementById('download3');
      var topicTimeSpent_chart_download_button: any = document.getElementById('download4')
      
      var subjectTimeSpentChart = new google.visualization.PieChart(document.getElementById('subjectTimeSpent_chart_div'));
      var topicTimeSpentChart = new google.visualization.PieChart(document.getElementById('topicTimeSpent_chart_div'));

      google.visualization.events.addListener(subjectTimeSpentChart, 'ready', function () {
        subjectTimeSpent_chart_download_button.href = subjectTimeSpentChart.getImageURI();
        console.log(subjectTimeSpent_chart_download_button.href);
      });

      google.visualization.events.addListener(topicTimeSpentChart, 'ready', function () {
        topicTimeSpent_chart_download_button.href = topicTimeSpentChart.getImageURI();
        console.log(topicTimeSpent_chart_download_button.href);
      });

      subjectTimeSpentChart.draw(subjectTimeSpentData, subjectTimeSpentOptions);
      topicTimeSpentChart.draw(topicTimeSpentData, topicTimeSpentOptions);




      //Bar chart Subjectwise
      let subjectWiseBarGraphData = new google.visualization.DataTable();
      subjectWiseBarGraphData.addColumn('string', 'Subject');
      subjectWiseBarGraphData.addColumn('number', 'Correct');
      subjectWiseBarGraphData.addColumn('number', 'Incorrect');
      subjectWiseBarGraphData.addColumn('number', 'Not Answered');
      subjectWiseBarGraphData.addRows(subjectTagBarGraphData);

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
     
      var subjectwise_bar_graph_download_button: any = document.getElementById('download1')
      var subjectChart = new google.visualization.ComboChart(document.getElementById('subjectwise_chart_div'));
       
      // Wait for the chart to finish drawing before calling the getImageURI() method.
       google.visualization.events.addListener(subjectChart, 'ready', function () {
        subjectwise_bar_graph_download_button.href = subjectChart.getImageURI();
        console.log(subjectwise_bar_graph_download_button.href);
      });

      subjectChart.draw(subjectWiseBarGraphData, options);


      //Bar chart Topic Wise
      let topicWiseBarGraphData = new google.visualization.DataTable();
      topicWiseBarGraphData.addColumn('string', 'Subject');
      topicWiseBarGraphData.addColumn('number', 'Correct');
      topicWiseBarGraphData.addColumn('number', 'Incorrect');
      topicWiseBarGraphData.addColumn('number', 'Not Answered');
      topicWiseBarGraphData.addRows(topicTagBarGraphData);

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

      var topicChart = new google.visualization.ComboChart(document.getElementById('topicwise_chart_div'));

      var topicwise_bar_graph_download_button: any = document.getElementById('download2')
      google.visualization.events.addListener(topicChart, 'ready', function () {
        topicwise_bar_graph_download_button.href = topicChart.getImageURI();
        console.log(subjectwise_bar_graph_download_button.href);
      });

      topicChart.draw(topicWiseBarGraphData, options1);
    }
    // var subject_chart_div =  document.getElementById('subject_chart_div');
    // var subjectTagChart = () => new google.visualization.PieChart(subject_chart_div);
    // var topicTagChart = () => new google.visualization.PieChart(document.getElementById('topic_chart_div'));

    var callback = () =>renderChart()
    google.charts.setOnLoadCallback( callback);
    window.onresize = ()=>{
        callback()
    };

    const subjectwise_chart : any = document.getElementById('subjectwise_chart_div');
    const topicwise_chart: any = document.getElementById('topicwise_chart_div');
    const subjectTimeSpent_chart : any = document.getElementById('subjectTimeSpent_chart_div');
    const topicTimeSpent_chart: any = document.getElementById('topicTimeSpent_chart_div');

    const buttonElement1 :any = document.getElementById('fullScreen1')
    buttonElement1.addEventListener('click', () => {
      if (screenfull.isEnabled) {
        screenfull.request(subjectwise_chart);
        
      }
    });

    const buttonElement2 :any = document.getElementById('fullScreen2')
    buttonElement2.addEventListener('click', () => {
      if (screenfull.isEnabled) {
        screenfull.request(topicwise_chart);
        
      }
    });

    const buttonElement3 :any = document.getElementById('fullScreen3')
    buttonElement3.addEventListener('click', () => {
      if (screenfull.isEnabled) {
        screenfull.request(subjectTimeSpent_chart);
        
      }
    });

    const buttonElement4 :any = document.getElementById('fullScreen4')
    buttonElement4.addEventListener('click', () => {
      if (screenfull.isEnabled) {
        screenfull.request(topicTimeSpent_chart);
        
      }
    });

      // screenfull.off('change', callback);
  }

  ngAfterViewInit(): void {
    this.dataSource.data = this.testToShowInTable.testQuestions
    this.dataSource.paginator = this.paginator;
    console.log("Questions",this.testToShowInTable.testQuestions)
    console.log(this.dataSource.data);

    // google.charts.load('current', {packages: ['corechart']});
    // this.buildChart(this.subjectTagBarGraphData, this.topicTagBarGraphData, this.subjectWiseTimeSpentPiechartData, this.topicWiseTimeSpentPiechartData )
  } 

  tabChanged(event:any):void{
    console.log("Tab event: ", event)
    if(event['index']==1 && this.count == 0){
      this.count++;
      console.log("Chart entered: ", this.count)
      this.buildChart(this.subjectTagBarGraphData, this.topicTagBarGraphData, this.subjectWiseTimeSpentPiechartData, this.topicWiseTimeSpentPiechartData )
    }
  }

  viewIndividualQuestion(element: TestReportQuestion, questionNumber: number):void{

    const dialogRef = this.dialog.open(IndividualquestionComponent,{
      data: {
        testReportQuestion: element,
        questionNumber: questionNumber
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });

    // console.log("elementt: ", element)
    // this.router.navigate(
    //   ['studentProfile/individualQuestion'],
    //   {
    //     queryParams: 
    //       {
    //         question: JSON.stringify(element)
    //       }, 
    //   }
    // )
  }
}
