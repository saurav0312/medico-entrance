import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Chart } from 'chart.js'
import { Observable } from 'rxjs';
import { MockTest } from 'src/app/interface/mockTest';
import { TestIdWithName } from 'src/app/interface/test-id-with-name';
import { AuthService } from 'src/app/service/auth.service';

declare var google: any;

@Component({
  selector: 'app-student-performance-analysis-dashboard',
  templateUrl: './student-performance-analysis-dashboard.component.html',
  styleUrls: ['./student-performance-analysis-dashboard.component.css']
})
export class StudentPerformanceAnalysisDashboardComponent implements OnInit {

  // @ViewChild('myChart') myChart: any;
  // canvas: any;
  // ctx: any;

  subjectProgressValue: number = 70;
  mockTestProgressValue: number = 30;

  subjectNameList: string[] = [];
  subjectToTopicListMap: {[key:string]: string[]} = {};
  subjectToTopicList: string[] = [];

  selectedSubjectIndex = -1;
  selectedSubjectName = '';
  selectedTopicIndex = -1;
  selectedTopicName = '';
  subjectTestsIdList : Array<TestIdWithName> = [];


  subjectToTopicToTestIdList: any = {};

  loading: boolean = false;
  allSubjectTestsList: MockTest[] = [];

  constructor(
    private authService: AuthService,
    private router: Router
  ) { }

  ngOnInit(): void {
    google.charts.load('current', {packages: ['corechart']});
    this.buildOverallPerformanceChart();
    this.findSubjectNameList().subscribe((response: MockTest[]) =>{
      console.log("All subject Test lists: ", response)
      this.allSubjectTestsList = response
      response.forEach((subjectTest:MockTest) =>{
        if(this.subjectNameList.find(subjectName => subjectName === subjectTest.subjectName) === undefined){
          this.subjectNameList.push(subjectTest.subjectName)
        }
        if(this.subjectToTopicListMap[subjectTest.subjectName] === undefined){
          this.subjectToTopicListMap[subjectTest.subjectName] = []
        }
        if(this.subjectToTopicListMap[subjectTest.subjectName].find(topicName => topicName === subjectTest.topicName) === undefined){
          this.subjectToTopicListMap[subjectTest.subjectName].push(subjectTest.topicName)
        }

        if(this.subjectToTopicToTestIdList[subjectTest.subjectName] === undefined){
          this.subjectToTopicToTestIdList[subjectTest.subjectName] = {};
        }
        if(this.subjectToTopicToTestIdList[subjectTest.subjectName][subjectTest.topicName] === undefined){
          this.subjectToTopicToTestIdList[subjectTest.subjectName][subjectTest.topicName] = [];
        }

          
          console.log("temp tedts: ", this.subjectToTopicToTestIdList)

        // if(this.subjectToTopicToTestIdList[subjectTest.subjectName][subjectTest.topicName] === undefined){
        //   this.subjectToTopicToTestIdList[subjectTest.subjectName][subjectTest.topicName] = [];
        // }
        this.subjectToTopicToTestIdList[subjectTest.subjectName][subjectTest.topicName].push(
          {
            "testId": subjectTest.id,
            "testName": subjectTest.testName 
          })
      })

      console.log("All topic name: ", this.subjectToTopicListMap)
      console.log("All subject name: ", this.subjectNameList)
      console.log("All subject to topic to testId: ", this.subjectToTopicToTestIdList)
    })
  }

  buildOverallPerformanceChart(){

    var renderChart = ()=>{
      
    var data = google.visualization.arrayToDataTable([
      ['Category', 'No of Questions'],
      ['Correct Answer',     110],
      ['Incorrect Answer',      200],
      ['Unanswered',  205]
    ]);

    var options = {
      pieHole: 0.44,
      pieSliceText:'value',
      tooltip:{
        text:'value'
      },
      slices: {0: {color: '#51f57c'}, 1: {color: 'f34c4c'}, 2: {color: 'cfcdcd'}}
    };

    var chart = new google.visualization.PieChart(document.getElementById('donutchart'));
    chart.draw(data, options);
    }

    var callback = () =>renderChart()
    google.charts.setOnLoadCallback( callback);
  }

  findSubjectNameList(): Observable<any>{
    return this.authService.findSubjectNameList("Subject");
  }
  
  onSelectingSubject(index: number){
    this.selectedSubjectIndex = index;
    this.subjectTestsIdList = [];
    this.selectedTopicIndex = -1;
    this.selectedSubjectName = this.subjectNameList[index]

    this.subjectToTopicList = this.subjectToTopicListMap[this.subjectNameList[index]]
    // switch(this.subjectNameList[index]){
    //   case 'Math':
    //     this.subjectToTopicList =['Arithmetic','Algebra','Geometry']
    //     break;
    //   case 'Science':
    //     this.subjectToTopicList =['Thermodynamic','Heat','Temperature']
    // }
  }

  onSelectingTopic(index: number){
    this.selectedTopicIndex = index
    this.selectedTopicName = this.subjectToTopicList[this.selectedTopicIndex]

    this.subjectTestsIdList = this.subjectToTopicToTestIdList[this.selectedSubjectName][this.selectedTopicName]
    this.subjectTestsIdList.sort((a,b) =>{
      if(a.testName < b.testName){
        return -1;
      }
      else if(a.testName > b.testName){
        return 1;
      }
      else return 0;
    })
  }

  startTest(testIdMap: TestIdWithName){
    console.log("Selected test: ", testIdMap)
    let test: MockTest| undefined = this.allSubjectTestsList.find(test => test.id === testIdMap.testId)
    if(test !== undefined){
      this.router.navigate(["/practicetest/testInstructions"], {queryParams: {data: testIdMap.testId, testTime: test.totalTime, testCategory: "Subject"}})
    }
  }
}
