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

  subjectProgressValue: number = 0;
  mockTestProgressValue: number = 0;

  subjectNameList: string[] = [];
  subjectToTopicListMap: {[key:string]: string[]} = {};
  subjectToTopicList: string[] = [];

  selectedSubjectIndex = -1;
  selectedSubjectName = '';
  selectedTopicIndex = -1;
  selectedTopicName = '';
  subjectTestsIdList : Array<TestIdWithName> = [];
  listOfSubjectTests: MockTest[] = [];
  listOfMockTests: MockTest[] = [];

  noOfMockTestsGivenByTheUser: number = 0;
  noOfSubjectTestsGivenByTheUser: number = 0;

  noOfCorrectAnswers: number = 0;
  noOfIncorrectAnswers: number = 0;
  noOfQuestionsNotAnswered: number = 0;


  subjectToTopicToTestIdList: any = {};

  loading: boolean = false;
  allSubjectTestsList: MockTest[] = [];

  constructor(
    private authService: AuthService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.loading = true;
    google.charts.load('current', {packages: ['corechart']});

    this.authService.getCurrentUser().subscribe(currentUser =>{
      this.authService.getAllMockTestsGivenByAUser(currentUser.uid).subscribe(allMockTestsGivenByUser =>{
        console.log("All mock tests given by user: ", allMockTestsGivenByUser)
        let totalNumberOfTestsGiven = allMockTestsGivenByUser.allTests.length
        let allSubjectTestGiven = allMockTestsGivenByUser.allTests.filter(test => test.testCategory ==='Subject')

        console.log("AllTests list: ", allMockTestsGivenByUser )
        let allMockTestGiven = allMockTestsGivenByUser.allTests.filter(test => test.testCategory ==='Mock')
        
        console.log("AllmoccccTests list: ", allMockTestGiven )
        let unqiueSubjectTestsIdList: string[] = [];
        
        allSubjectTestGiven.forEach(subjectTest =>{
          if(unqiueSubjectTestsIdList.length > 0){ 
            if(!unqiueSubjectTestsIdList.find(testId => testId === subjectTest.testId)){
              unqiueSubjectTestsIdList.push(subjectTest.testId);
            }
          }
          else{
            unqiueSubjectTestsIdList.push(subjectTest.testId);
          }
        })
        this.noOfSubjectTestsGivenByTheUser = unqiueSubjectTestsIdList.length


        let unqiueMockTestsIdList: string[] = [];

        console.log("All mocktestgiven list: ", allMockTestGiven)
        
        allMockTestGiven.forEach(mockTest =>{
          if(unqiueMockTestsIdList.length > 0){
            if(!unqiueMockTestsIdList.find(testId => testId === mockTest.testId)){
              unqiueMockTestsIdList.push(mockTest.testId);
            }
          }
          else{
            unqiueMockTestsIdList.push(mockTest.testId);
          }
        })
        console.log("Unique mock testid list: ", unqiueMockTestsIdList)
        this.noOfMockTestsGivenByTheUser = unqiueMockTestsIdList.length

        allMockTestsGivenByUser.allTests.forEach(test =>{
          test.testQuestions.forEach(question =>{
            //option selected
            if(question.selectedOption!== null){
              if(question.selectedOption === question.correctAnswer)
              {
                this.noOfCorrectAnswers += 1;               
              }
              else{
                this.noOfIncorrectAnswers +=1;
              }
            }
            //option not selected
            else{
              this.noOfQuestionsNotAnswered +=1;
            }
          })
        })

        //prepare overall performance chart
        let chartData:any = [];
        chartData.push(['Correct Answer',  this.noOfCorrectAnswers])
        chartData.push(['Incorrect Answer',  this.noOfIncorrectAnswers])
        chartData.push(['Unanswered',  this.noOfQuestionsNotAnswered])
        this.buildOverallPerformanceChart(chartData);

      })
    })


    this.fetchTestsList("Subject").subscribe((response: MockTest[]) =>{
      console.log("All subject Test lists: ", response)
      this.allSubjectTestsList = response
      if(response!== undefined && response.length > 0){
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
          this.subjectToTopicToTestIdList[subjectTest.subjectName][subjectTest.topicName].push(
          {
            "testId": subjectTest.id,
            "testName": subjectTest.testName 
          })
        })
      }
      this.loading= false;
    },
    error =>{
      window.alert(error.error)
      this.loading = false;
    });

    this.fetchTestsList("Mock").subscribe(mockTestResponse =>{
      console.log("Mock tests list: ", mockTestResponse)
      this.listOfMockTests = mockTestResponse
      this.listOfMockTests.sort((a,b) =>{
        if(a.testType < b.testType){
          return -1;
        }
        else if(a.testType > b.testType){
          return 1;
        }
        else{
          return 0;
        }
      })
    },
    error =>{
      window.alert(error.error)
      this.loading = false;
    })
  }

  buildOverallPerformanceChart(chartData: any){

    var renderChart = ()=>{
      
    var data = new google.visualization.DataTable();

    data.addColumn('string', 'Category')
    data.addColumn('number','No of Questions')
    data.addRows(chartData)

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

  fetchTestsList(testCategory: string): Observable<any>{
    return this.authService.fetchTestsList(testCategory);
  }
  
  onSelectingSubject(index: number){
    if(this.selectedSubjectIndex !== index){
      this.selectedSubjectIndex = index;
      this.subjectTestsIdList = [];
      this.listOfSubjectTests = [];
      this.selectedTopicIndex = -1;
      this.selectedSubjectName = this.subjectNameList[index]

      this.subjectToTopicList = this.subjectToTopicListMap[this.subjectNameList[index]]
    }
  }

  onSelectingTopic(index: number){

    if(this.selectedTopicIndex !== index){
      this.selectedTopicIndex = index
      this.selectedTopicName = this.subjectToTopicList[this.selectedTopicIndex]

      this.listOfSubjectTests = [];

      this.subjectTestsIdList = this.subjectToTopicToTestIdList[this.selectedSubjectName][this.selectedTopicName]
      console.log("Subjetc topic subject list: ", this.subjectTestsIdList)

      this.subjectTestsIdList.forEach(testId =>{
        let tempTest: any = this.allSubjectTestsList.find(subjecTest => subjecTest.id === testId.testId);
        if( tempTest !== undefined){
          this.listOfSubjectTests.push(tempTest)
        }
      })
      
      this.listOfSubjectTests.sort((a,b) =>{
        if(a.testType < b.testType){
          return -1;
        }
        else if(a.testType > b.testType){
          return 1;
        }
        else return 0;
      })
    }
  }

  startTest(test: MockTest){
    console.log("Selected test: ", test)
    //let test: MockTest| undefined = this.allSubjectTestsList.find(test => test.id === testIdMap.testId)
    if(test !== undefined){
      this.router.navigate(["/practicetest/testInstructions"], {queryParams: {data: test.id, testTime: test.totalTime, testCategory: "Subject"}})
    }
  }
}
