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
import { IPerformance } from 'src/app/interface/performance';
import { TreeNode } from 'primeng/api';
import { TestReportData } from 'src/app/interface/testReportData';
import { formatDate } from '@angular/common';


declare var google: any;

@Component({
  selector: 'app-detailtestreport',
  templateUrl: './detailtestreport.component.html',
  styleUrls: ['./detailtestreport.component.scss'],
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
  success: number = 0;

  subjectThresholdValue: number = 1;
  topicThresholdValue: number = 1;

  strongSubjectList: {'strongSubject':Array<IPerformance>} = {
    'strongSubject': []
  };
  weakSubjectList: {'weakSubject':Array<IPerformance>} = {
    'weakSubject': []
  };
  strongTopicList: {'strongTopic':Array<IPerformance>} = {
    'strongTopic': []
  };
  weakTopicList: {'weakTopic':Array<IPerformance>} = {
    'weakTopic': []
  };

  // @Input() displayedColumns!: string[];
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


  displayedColumns = [
    { field: 'subjectTags', header: 'Subject Tags' },
    { field: 'topicTags', header: 'Topic Tags' },
    { field: 'result', header: 'Result' },
    { field: 'totalTimeSpent', header: 'Time Spent' },
  ];

  allTests: TreeNode[] = [];
  uniqueTestsList: {[key:string]: Array<any>} = {};
  testReportData! : TestReportData;
  defaultSelectedTest!: TreeNode;

  constructor(
    private activatedRoute: ActivatedRoute,
    private sharedService: SharedService,
    private authService: AuthService,
    private router: Router,
    private dialog: MatDialog,
  ) { }

  ngOnInit(): void {


    let sub = this.authService.getCurrentUser().subscribe(response =>{
      this.authService.getAllMockTestsGivenByAUser(response?.uid).subscribe(response =>{
        sub.unsubscribe()
        if(response!== undefined){
          this.testReportData = response
          console.log("Unique tests list before: ", this.uniqueTestsList)
          this.uniqueTestsList = {}
          this.testReportData.allTests.forEach(test =>{
            if(this.uniqueTestsList[test.testId]=== undefined){
              this.uniqueTestsList[test.testId] = [];
              this.uniqueTestsList[test.testId].push(test)
            }
            else{
              if(!this.uniqueTestsList[test.testId].find(ele => ele.testTakenDate === test.testTakenDate))
              this.uniqueTestsList[test.testId].push(test)
            }
          })
          console.log("Unique tests list: ", this.uniqueTestsList)

          let count = 0;
          let expanded =true;

          Object.keys(this.uniqueTestsList).forEach(key =>{
            if(count > 0){
              expanded = false;
            }

            if(this.allTests.length == 0 || !this.allTests.find(node => node.data === key))
            {

              let tempTreeData: TreeNode = {
                "label": this.uniqueTestsList[key][0].testName,
                "data": key,
                "children":[],
                "leaf":false,
                "expanded": expanded
              }

              this.uniqueTestsList[key].forEach(individualTest =>{
                let childrenTempData: TreeNode ={
                  "label": formatDate((<Timestamp><unknown>(individualTest.testTakenDate)).toDate(), 'medium','en-US'),
                  "data": individualTest,
                  "leaf": true
                }
                tempTreeData.children?.push(childrenTempData)
              })

              this.allTests.push(tempTreeData);
              count++;
            }
          })
          console.log("All testss: ", this.allTests)

          if(this.allTests.length >1 && this.allTests[0].children !== undefined){
            this.defaultSelectedTest = this.allTests[0].children[0]
            let nodeData ={
              'node': this.defaultSelectedTest
            }
            this.nodeSelected(nodeData)
          }
        }
      })
    })

    google.charts.load('current', {packages: ['corechart']}); 
  }


  prepareData(){
      this.testId = this.testToShowInTable.testId;
      if(this.testToShowInTable.testTakenDate !== undefined){
        const dateValue = <Timestamp><unknown>this.testToShowInTable.testTakenDate
        this.testTakenDate = new Date(dateValue['seconds']*1000)
      }

      this.singleTest = this.testToShowInTable
      if(this.singleTest !== undefined){
        
        //reseting all values to initial state
        this.subjectTagMap ={};
        this.topicTagMap ={};
        this.subjectTagBarGraphData = []
        this.topicTagBarGraphData = []

        this.subjectWiseTimeSpent = new Map();
        this.topicWiseTimeSpent = new Map();
        this.subjectWiseTimeSpentPiechartData = []
        this.topicWiseTimeSpentPiechartData = []

        this.strongSubjectList= {
          'strongSubject': []
        };
        this.weakSubjectList = {
          'weakSubject': []
        };
        this.strongTopicList = {
          'strongTopic': []
        };
        this.weakTopicList = {
          'weakTopic': []
        };

        this.singleTest.testQuestions.forEach(testQuestion =>{
          testQuestion.subjectTags?.forEach(subjectTag =>{
            this.subjectTagMap[subjectTag] ={'correct':0, 'incorrect':0,'not_answered':0}
          })

          testQuestion.topicTags?.forEach(topicTag =>{
            this.topicTagMap[topicTag] ={'correct':0, 'incorrect':0,'not_answered':0}
          })
        })

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

        //prepare data for subject bar graph
        Object.keys(this.subjectTagMap).forEach(key =>{
          let temppiechartData = [];

          let totalNoOfSubjectQuestion = this.subjectTagMap[key]['correct'] + this.subjectTagMap[key]['incorrect'] +
                                            this.subjectTagMap[key]['not_answered']

          temppiechartData.push(key)

          let successPercent = (this.subjectTagMap[key]['correct']/totalNoOfSubjectQuestion)*100;
          this.success =((100 * 6) - ((100 * 6) * ((21*successPercent)/100)) / 100)
          let tempSuccessValue: any ={
            'name': key,
            'successValue': this.success,
            'successPercent': successPercent
          }

          if(this.subjectTagMap[key]['correct'] >= this.subjectThresholdValue){

            this.strongSubjectList['strongSubject'].push(tempSuccessValue)
          }
          else{
            this.weakSubjectList['weakSubject'].push(tempSuccessValue)
          }

          temppiechartData.push(this.subjectTagMap[key]['correct'])
          temppiechartData.push(this.subjectTagMap[key]['incorrect'])
          temppiechartData.push(this.subjectTagMap[key]['not_answered'])
          this.subjectTagBarGraphData.push(temppiechartData)
        })

        //prepare data for topic bar graph
        Object.keys(this.topicTagMap).forEach(key =>{
          let temppiechartData = [];

          let totalNoOfTopicQuestion = this.topicTagMap[key]['correct'] + this.topicTagMap[key]['incorrect'] +
                                            this.topicTagMap[key]['not_answered']
          temppiechartData.push(key)

          let successPercent = (this.topicTagMap[key]['correct']/totalNoOfTopicQuestion)*100;

          this.success =((100 * 6) - ((100 * 6) * ((21*successPercent)/100)) / 100)

          let tempSuccessValue: any ={
            'name': key,
            'successValue': this.success,
            'successPercent': successPercent
          }

          if(this.topicTagMap[key]['correct'] >= this.topicThresholdValue){
            this.strongTopicList['strongTopic'].push(tempSuccessValue)
          }
          else{
            this.weakTopicList['weakTopic'].push(tempSuccessValue)
          }

          temppiechartData.push(this.topicTagMap[key]['correct'])
          temppiechartData.push(this.topicTagMap[key]['incorrect'])
          temppiechartData.push(this.topicTagMap[key]['not_answered'])
          this.topicTagBarGraphData.push(temppiechartData)
        })

        for (let entry of this.subjectWiseTimeSpent.entries()) {
          let temppiechartData = [];
          temppiechartData.push(entry[0]);
          temppiechartData.push(entry[1]);
          this.subjectWiseTimeSpentPiechartData.push(temppiechartData)
        }

        for (let entry of this.topicWiseTimeSpent.entries()) {
          let temppiechartData = [];
          temppiechartData.push(entry[0]);
          temppiechartData.push(entry[1]);
          this.topicWiseTimeSpentPiechartData.push(temppiechartData)
        }

        // this.buildChart(this.subjectTagBarGraphData, this.topicTagBarGraphData, this.subjectWiseTimeSpentPiechartData, this.topicWiseTimeSpentPiechartData )
      }
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
  }

  ngAfterViewInit(): void {
    
  } 

  tabChanged(event:any):void{
    this.buildChart(this.subjectTagBarGraphData, this.topicTagBarGraphData, this.subjectWiseTimeSpentPiechartData, this.topicWiseTimeSpentPiechartData )
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
  }

  nodeSelected(event:any){
    console.log("Node selected: ", event)
    if(event.node.leaf == true){
      this.testToShowInTable = event.node.data
      this.prepareData()
    }
  }
}
