import { formatDate } from '@angular/common';
import { Component, ElementRef, HostListener, Input, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute } from '@angular/router';
import { Timestamp } from 'firebase/firestore';
import { TreeNode } from 'primeng/api';
import { BehaviorSubject } from 'rxjs';
import { IPerformance } from 'src/app/interface/performance';
import { SubjectList } from 'src/app/interface/subject-list';
import { TestReportData } from 'src/app/interface/testReportData';
import { TestReportQuestion } from 'src/app/interface/testReportQuestion';
import { Tests } from 'src/app/interface/tests';
import { AuthService } from 'src/app/service/auth.service';
import { IndividualquestionComponent } from 'src/app/student/individualquestion/individualquestion.component';
import screenfull from 'screenfull';
import Chart from 'chart.js/auto';

@Component({
  selector: 'app-view-test-history-of-astudent-on-atest',
  templateUrl: './view-test-history-of-astudent-on-atest.component.html',
  styleUrls: ['./view-test-history-of-astudent-on-atest.component.scss']
})
export class ViewTestHistoryOfAStudentOnATestComponent implements OnInit {

  testId!: string;
  userId!: string;


  expandedElement!: TestReportQuestion | null;

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

  subjectThresholdValue: number = 10;
  topicThresholdValue: number = 10;

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

  subjectNameList: string[] = [];
  topicNameList: string[] = [];

  subjectWiseCorrectAnswersData: number[] = [];
  subjectWiseIncorrectAnswersData: number[] = [];
  subjectWiseNotAnsweredData: number[] = [];

  topicWiseCorrectAnswersData: number[] = [];
  topicWiseIncorrectAnswersData: number[] = []
  topicWiseNotAnsweredData: number[] = []

  selectedSubjectInTopicWiseBargraph: string = '';
  selectedSubjectInTopicWisePiechart: string = '';
  previouslySelectedSubjectInTopicWiseBargraph: string = '';
  previouslySelectedSubjectInTopicWisePiechart: string = ''
  subjectListDropdownOptions: SubjectList[] = [];

  defaultSelectedSubjectInTopicWiseBarGraph: any;
  defaultSelectedSubjectInTopicWisePieChart: any;

  subjectWiseChart: any;
  topicWiseChart: any;

  colors: string[] = [];

  subjectWiseTimeSpentChart: any;
  topicWiseTimeSpentChart: any;

  subjectWiseTimeSpentPieChartLabels: string[] = []
  subjectWiseTimeSpentPieChartData: number[] = []

  topicWiseTimeSpentPieChartLabels: string[] = []
  topicWiseTimeSpentPieChartData: number[] = []

  subjectNameWithTopicsMap: {[key:string]:string[]} ={};

  isNewUser: boolean = false;

  @ViewChild('hello', {static: true}) private chartRef!: ElementRef;

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

  smallScreen: boolean = false;

  screenWidth!: number;

  private screenWidth$ = new BehaviorSubject<number>(window.innerWidth);

  @HostListener('window:resize', ['$event'])
    onResize(event: any) {
        if (event.target.innerWidth < 510) {
          this.smallScreen = true
        }
        else{
          this.smallScreen = false;
        }
    }

  constructor(
    private route: ActivatedRoute,
    private authService: AuthService,
    private dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.route.queryParams.subscribe( (response:any) =>{
      this.testId = <string>response.testId
      this.userId = <string>response.userId
      this.authService.getAllHistoryOfAMockTestGivenByAUserForTeacherAnalysis(this.userId, this.testId).subscribe(allTestsResponse =>{
        this.testReportData = allTestsResponse

        if(this.testReportData.allTests.length > 0){
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

          if(this.allTests.length > 0 && this.allTests[0].children !== undefined){
            this.defaultSelectedTest = this.allTests[0].children[0]
            let nodeData ={
              'node': this.defaultSelectedTest
            }
            this.nodeSelected(nodeData)
          }
        }
        else{
          this.isNewUser = true;
        }

      })
    })
  }

  nodeSelected(event:any){
    if(event.node.leaf == true){
      this.testToShowInTable = event.node.data
      this.prepareData()
    }
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
          if(this.subjectNameWithTopicsMap[subjectTag] === undefined){
            this.subjectNameWithTopicsMap[subjectTag] = <string[]>testQuestion.topicTags
          }
          else{
            testQuestion.topicTags?.forEach(topic =>{
              if(!this.subjectNameWithTopicsMap[subjectTag].includes(topic)){
                this.subjectNameWithTopicsMap[subjectTag].push(topic)
              }
            })
            //this.subjectNameWithTopicsMap[subjectTag] = this.subjectNameWithTopicsMap[subjectTag].concat(<string[]>testQuestion.topicTags)
          }
        })
        

        testQuestion.topicTags?.forEach(topicTag =>{
          this.topicTagMap[topicTag] ={'correct':0, 'incorrect':0,'not_answered':0}
        })
      })

      this.totalScore = 0;
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

      //prepare data for subject bar graph for chart js
      this.subjectNameList = []
      this.subjectWiseCorrectAnswersData = []
      this.subjectWiseIncorrectAnswersData = []
      this.subjectWiseNotAnsweredData = []
      this.subjectListDropdownOptions = []

      Object.keys(this.subjectTagMap).forEach(key =>{
        this.subjectNameList.push(key)

        let temp : SubjectList = {
          name: key
        }

        this.subjectListDropdownOptions.push(temp)

        this.subjectWiseCorrectAnswersData.push(this.subjectTagMap[key]['correct'])
        this.subjectWiseIncorrectAnswersData.push(this.subjectTagMap[key]['incorrect'])
        this.subjectWiseNotAnsweredData.push(this.subjectTagMap[key]['not_answered'])
      })

      //prepare data for topic wise bar graph for chart js

      this.topicNameList = []
      this.topicWiseCorrectAnswersData = []
      this.topicWiseIncorrectAnswersData = []
      this.topicWiseNotAnsweredData = []

      Object.keys(this.topicTagMap).forEach(key =>{
        this.topicNameList.push(key)
        this.topicWiseCorrectAnswersData.push(this.topicTagMap[key]['correct'])
        this.topicWiseIncorrectAnswersData.push(this.topicTagMap[key]['incorrect'])
        this.topicWiseNotAnsweredData.push(this.topicTagMap[key]['not_answered'])
      })

      //prepare data for subject wise time spent pie chart
      this.subjectWiseTimeSpentPieChartLabels = []
      this.subjectWiseTimeSpentPieChartData = []
      
      for (let entry of this.subjectWiseTimeSpent.entries()){
        if(entry[1] > 0){
          this.subjectWiseTimeSpentPieChartLabels.push(entry[0])
          this.subjectWiseTimeSpentPieChartData.push(entry[1])
        }
      }
      
      this.topicWiseTimeSpentPieChartLabels = []
      this.topicWiseTimeSpentPieChartData = []
      for (let entry of this.topicWiseTimeSpent.entries()){
        if(entry[1] > 0){
          this.topicWiseTimeSpentPieChartLabels.push(entry[0])
          this.topicWiseTimeSpentPieChartData.push(entry[1])
        }
      }        

      //prepare data for strong subject and topic
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
          'successPercent': Math.round(successPercent)
        }

        if(Math.round(successPercent) > this.subjectThresholdValue){
          this.strongSubjectList['strongSubject'].push(tempSuccessValue)
        }
        else{
          this.weakSubjectList['weakSubject'].push(tempSuccessValue)
        }
      })

      //prepare data for weak subject and topic
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
          'successPercent': Math.round(successPercent)
        }

        if(this.topicTagMap[key]['correct'] >= this.topicThresholdValue){
          this.strongTopicList['strongTopic'].push(tempSuccessValue)
        }
        else{
          this.weakTopicList['weakTopic'].push(tempSuccessValue)
        }
      })


    }

    this.tabChanged('sample')
  }

  fullScreen1(){
    const subjectwise_chart : any = document.getElementById('subjectWiseBarGraph');
    screenfull.request(subjectwise_chart);
  }

  fullScreen2(){
    const topicwise_chart : any = document.getElementById('topicWiseBarGraph');
    screenfull.request(topicwise_chart);
  }

  fullScreen3(){
    const subjectwisetimespent_piechart : any = document.getElementById('subjectWiseTimeSpentPieChart');
    screenfull.request(subjectwisetimespent_piechart);
  }

  fullScreen4(){
    const topicwisetimespent_piechart : any = document.getElementById('topicWiseTimeSpentPieChart');
    screenfull.request(topicwisetimespent_piechart);
  }

  downloadSubjectWiseChartImage(){
    var a = document.createElement('a');
    a.href = this.subjectWiseChart.toBase64Image();
    a.download = 'subjectWiseBarGraph.png';

    // Trigger the download
    a.click();
  }

  downloadTopicWiseChartImage(){
    var a = document.createElement('a');
    a.href = this.topicWiseChart.toBase64Image();
    a.download = 'topicWiseBarGraph.png';

    // Trigger the download
    a.click();
  }

  downloadSubjectWiseTimeSpentChartImage(){
    var a = document.createElement('a');
    a.href = this.subjectWiseTimeSpentChart.toBase64Image();
    a.download = 'subjectWiseTimeSpentPieChart.png';

    // Trigger the download
    a.click();
  }

  downloadTopicWiseTimeSpentChartImage(){
    var a = document.createElement('a');
    a.href = this.topicWiseTimeSpentChart.toBase64Image();
    a.download = 'topicWiseTimeSpentPieChart.png';

    // Trigger the download
    a.click();
  }


  prepareSubjectWiseBarGraph(){
    const labels = this.subjectNameList
    const data = {
      labels: labels,
      datasets: [
        {
          label: 'Correct',
          data: this.subjectWiseCorrectAnswersData,
          backgroundColor: '#fd7f6f',
        },
        {
          label: 'Incorrect',
          data: this.subjectWiseIncorrectAnswersData,
          backgroundColor: '#7eb0d5',
        },
        {
          label: 'Not Answered',
          data: this.subjectWiseNotAnsweredData,
          backgroundColor: '#b2e061',
        },
      ]
    };

    const plugin = {
      id: 'custom_canvas_background_color',
      beforeDraw: (chart:any) => {
        const ctx = chart.canvas.getContext('2d');
        ctx.save();
        ctx.globalCompositeOperation = 'destination-over';
        ctx.fillStyle = 'white';
        ctx.fillRect(0, 0, chart.width, chart.height);
        ctx.restore();
      }
    };

    const config: any = {
      type: 'bar',
      data: data,
      options: {
        plugins: {
          title: {
            display: true,
            text: 'Subjectwise Analysis'
          },
        },
        responsive: true,
        scales: {
          x: {
            stacked: true,
          },
          y: {
            stacked: true
          }
        }
      },
      plugins: [plugin]
    };

    var subjectWiseChartEle: any = document.getElementById('subjectWiseBarGraph')
    this.subjectWiseChart = new Chart(
      subjectWiseChartEle,
      config
    )
  }

  prepareTopicWiseBarGraph(){
    const labels = this.topicNameList
    const data = {
      labels: labels,
      datasets: [
        {
          label: 'Correct',
          data: this.topicWiseCorrectAnswersData,
          backgroundColor: "#fd7f6f",
        },
        {
          label: 'Incorrect',
          data: this.topicWiseIncorrectAnswersData,
          backgroundColor: "#7eb0d5",
        },
        {
          label: 'Not Answered',
          data: this.topicWiseNotAnsweredData,
          backgroundColor: '#b2e061',
        },
      ]
    };

    const plugin = {
      id: 'custom_canvas_background_color',
      beforeDraw: (chart:any) => {
        const ctx = chart.canvas.getContext('2d');
        ctx.save();
        ctx.globalCompositeOperation = 'destination-over';
        ctx.fillStyle = 'white';
        ctx.fillRect(0, 0, chart.width, chart.height);
        ctx.restore();
      }
    };

    const config: any = {
      type: 'bar',
      data: data,
      options: {
        plugins: {
          title: {
            display: true,
            text: 'Topicwise Analysis'
          },
        },
        responsive: true,
        scales: {
          x: {
            stacked: true,
          },
          y: {
            stacked: true
          }
        }
      },
      plugins: [plugin]
    };

    var topicWiseChartEle: any = document.getElementById('topicWiseBarGraph')
    this.topicWiseChart = new Chart(
      topicWiseChartEle,
      config
    )
  }


  prepareSubjectWiseTimeSpentChart(chartLabels: string[], chartData: number[], elementId: string, chartTitle: string){
    const data = {
      labels: chartLabels,
      datasets: [{
        label: 'Overall Performance',
        data: chartData,
        hoverOffset: 4,
        backgroundColor: this.colors
      }]
    };

    const plugin = {
      id: 'custom_canvas_background_color',
      beforeDraw: (chart:any) => {
        const ctx = chart.canvas.getContext('2d');
        ctx.save();
        ctx.globalCompositeOperation = 'destination-over';
        ctx.fillStyle = 'white';
        ctx.fillRect(0, 0, chart.width, chart.height);
        ctx.restore();
      }
    };

    var pieChartEle: any = document.getElementById(elementId)
    this.subjectWiseTimeSpentChart = new Chart(
      pieChartEle,
      {
        type: 'doughnut',
        data: data,
        options: {
          responsive: true,
          maintainAspectRatio: true,
          plugins: {
            title: {
                display: true,
                text: chartTitle
            }
          }
        },
        plugins:[plugin]
      }
    );
  }

  prepareTopicWiseTimeSpentChart(chartLabels: string[], chartData: number[], elementId: string, chartTitle: string){

    const data = {
      labels: chartLabels,
      datasets: [{
        label: 'Overall Performance',
        data: chartData,
        hoverOffset: 4,
        backgroundColor: this.colors
      }]
    };

    const plugin = {
      id: 'custom_canvas_background_color',
      beforeDraw: (chart:any) => {
        const ctx = chart.canvas.getContext('2d');
        ctx.save();
        ctx.globalCompositeOperation = 'destination-over';
        ctx.fillStyle = 'white';
        ctx.fillRect(0, 0, chart.width, chart.height);
        ctx.restore();
      }
    };

    var pieChartEle: any = document.getElementById(elementId)
    this.topicWiseTimeSpentChart = new Chart(
      pieChartEle,
      {
        type: 'doughnut',
        data: data,
        options: {
          responsive: true,
          maintainAspectRatio: true,
          plugins: {
            title: {
                display: true,
                text: chartTitle
            }
          }
        },
        plugins:[plugin]
      }
    );
  }

  generateRandomColor(data: any){

    let tempColorList = ["#fd7f6f", "#7eb0d5", "#b2e061", "#bd7ebe", "#ffb55a", "#ffee65", "#beb9db", "#fdcce5", "#8bd3c7"]

    this.colors = tempColorList.slice(0, data.length)


    //temporarily commenting -> will uncomment when dynamic color is required
    // var letters = '0123456789ABCDEF'.split('');
    // let totalColorCount = 0;
    // while(1){
    //   var newColor = '#';
    //   for (var j = 0; j < 6; j++ ) {
    //     newColor += letters[Math.floor(Math.random() * 16)];
    //   }
    //   console.log("Here")
    //   if(this.colors.length > 0 && this.colors.find(existingColor => existingColor == newColor) === undefined){
    //     this.colors.push(newColor)
    //     totalColorCount++;
    //     console.log("Total color count: ", totalColorCount)
    //     if(totalColorCount == data.length){
    //       break;
    //     }
    //   }
    //   else if(this.colors.length === 0){
    //     this.colors.push(newColor)
    //     totalColorCount++;
    //     console.log("Total color count else: ", totalColorCount)
    //     if(totalColorCount == data.length){
    //       break;
    //     }
    //   }
    // }
  }


  ngAfterViewInit(): void {
    this.screenWidth$.subscribe(width => {
      if (width < 510) {
        this.smallScreen = true;
      }
      else{
        this.smallScreen = false
      }
    });
  } 

  tabChanged(event:any):void{

    if(this.subjectWiseChart !== undefined){
      this.subjectWiseChart.destroy()
    }

    if(this.topicWiseChart !== undefined){
      this.topicWiseChart.destroy()
    }

    if(this.subjectWiseTimeSpentChart !== undefined){
      this.subjectWiseTimeSpentChart.destroy()
    }

    if(this.topicWiseTimeSpentChart !== undefined){
      this.topicWiseTimeSpentChart.destroy()
    }

    this.prepareSubjectWiseBarGraph()
    this.prepareTopicWiseBarGraph()
    this.generateRandomColor(this.subjectWiseTimeSpentPieChartData)
    this.prepareSubjectWiseTimeSpentChart(this.subjectWiseTimeSpentPieChartLabels, this.subjectWiseTimeSpentPieChartData, 'subjectWiseTimeSpentPieChart' , 'Subjectwise Time Spent Chart')

    this.generateRandomColor(this.topicWiseTimeSpentPieChartData)
    this.prepareTopicWiseTimeSpentChart(this.topicWiseTimeSpentPieChartLabels, this.topicWiseTimeSpentPieChartData, 'topicWiseTimeSpentPieChart' , 'Topicwise Time Spent Chart')

    // This is for default value of chart dropdown. will use it later
    let subjectEvent :any ={
      'value':{
        'name': this.subjectListDropdownOptions[0].name 
      }
    }

    this.previouslySelectedSubjectInTopicWiseBargraph = '';
    this.defaultSelectedSubjectInTopicWiseBarGraph = this.subjectListDropdownOptions[0]
    this.subjectSelectedForTopicWiseChart(subjectEvent)

    this.previouslySelectedSubjectInTopicWisePiechart = '';
    this.defaultSelectedSubjectInTopicWisePieChart = this.subjectListDropdownOptions[0]
    this.subjectSelectedForTopicWiseTimeSpentChart(subjectEvent);
  }

  subjectSelectedForTopicWiseChart(event: any){
    let subjectName = event.value.name
    if(subjectName !== undefined && subjectName !== this.previouslySelectedSubjectInTopicWiseBargraph){
      let topicList: string[] = this.subjectNameWithTopicsMap[subjectName]

      this.topicNameList = []
      this.topicWiseCorrectAnswersData = []
      this.topicWiseIncorrectAnswersData = []
      this.topicWiseNotAnsweredData = []
      Object.keys(this.topicTagMap).forEach(key =>{

        //if topic list contains key then insert that key for the topic graph
        if(topicList.includes(key)){
          this.topicNameList.push(key)
          this.topicWiseCorrectAnswersData.push(this.topicTagMap[key]['correct'])
          this.topicWiseIncorrectAnswersData.push(this.topicTagMap[key]['incorrect'])
          this.topicWiseNotAnsweredData.push(this.topicTagMap[key]['not_answered'])
        }
      })

      this.removeData(this.topicWiseChart)

      const data = {
        labels: this.topicNameList,
        datasets: [
          {
            label: 'Correct',
            data: this.topicWiseCorrectAnswersData,
            backgroundColor: '#fd7f6f',
          },
          {
            label: 'Incorrect',
            data: this.topicWiseIncorrectAnswersData,
            backgroundColor: '#7eb0d5',
          },
          {
            label: 'Not Answered',
            data: this.topicWiseNotAnsweredData,
            backgroundColor: '#b2e061',
          },
        ]
      };

      this.addData(this.topicWiseChart, data )
      this.previouslySelectedSubjectInTopicWiseBargraph = subjectName
    }
    

  }


  subjectSelectedForTopicWiseTimeSpentChart(event: any){

    let subjectName = event.value.name
    if(subjectName !== undefined && subjectName !== this.previouslySelectedSubjectInTopicWisePiechart){
      let topicList: string[] = this.subjectNameWithTopicsMap[subjectName]

      this.removeData(this.topicWiseTimeSpentChart)

      let labels = [];
      let pieChartData = [];
      
      for (let entry of this.topicWiseTimeSpent.entries()){
        if(topicList.includes(entry[0])){
          labels.push(entry[0])
          pieChartData.push(entry[1])
        }
      }

      this.generateRandomColor(pieChartData)
      const data = {
        labels: labels,
        datasets: [{
          label: 'Overall Performance',
          data: pieChartData,
          hoverOffset: 4,
          backgroundColor: this.colors
        }]
      };
      this.addData(this.topicWiseTimeSpentChart, data )
      this.previouslySelectedSubjectInTopicWisePiechart = subjectName
    }
  }


  addData(chart:any, data: any) {

    chart.data = data
    chart.update();
  }

  removeData(chart:any) {
      chart.data.labels.pop();
      chart.data.datasets.forEach((dataset:any) => {
          dataset.data.pop();
      });
      chart.update();
  }

  viewIndividualQuestion(element: TestReportQuestion, questionNumber: number):void{

    const dialogRef = this.dialog.open(IndividualquestionComponent,{
      data: {
        testReportQuestion: element,
        questionNumber: questionNumber
      }
    });

    dialogRef.afterClosed().subscribe(result => {
    });
  }

}
