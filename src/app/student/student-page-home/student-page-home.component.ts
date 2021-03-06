import { Component, ElementRef, HostListener, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { MockTestWithAlreadyGiven } from 'src/app/interface/mock-test-with-already-given';
import { MockTest } from 'src/app/interface/mockTest';
import { AuthService } from 'src/app/service/auth.service';
import  Chart from 'chart.js/auto'
import { TestsubscriptionService } from 'src/app/service/testsubscription.service';

@Component({
  selector: 'app-student-page-home',
  templateUrl: './student-page-home.component.html',
  styleUrls: ['./student-page-home.component.css']
})
export class StudentPageHomeComponent implements OnInit, OnDestroy {

  constructor(
    private authService: AuthService,
    private router: Router,
    private elementRef: ElementRef,
    private testsubscriptionService: TestsubscriptionService
  ) { }

  @ViewChild('banner') banner! : HTMLElement;

  displayedColumns = [
    { field: 'testName', header: 'Test Name' },
    { field: 'source', header: 'Source' },
    { field: 'status', header: 'Status' }
  ];

  tableData =[{
    'testName':"Sample",
    'source': "A",
    'status': "test"
  },
  {
    'testName':"Sample 2",
    'source': "B",
    'status': "test"
  }]

  allAvailableTests: MockTestWithAlreadyGiven[] = [];

  allSubjectTests: MockTestWithAlreadyGiven[] = [];
  allSubjectTestsForTable: MockTestWithAlreadyGiven[] = [];
  allMockTests: MockTestWithAlreadyGiven[] = [];
  allMockTestsForTable: MockTestWithAlreadyGiven[] = [];

  initialMockTestListFilterLength: number = 2;
  initialSubjectTestListFilterLength: number = 2;

  userId!: string | undefined;

  noOfMockTestsGivenByTheUser: number = 0;
  noOfSubjectTestsGivenByTheUser: number = 0;

  noOfCorrectAnswers: number = 0;
  noOfIncorrectAnswers: number = 0;
  noOfQuestionsNotAnswered: number = 0;
  totalNoOfQuestions: number = 0;

  subjectTagMap: {[key:string]:{[key:string]:number}} ={};

  colors: string[] = [];
  loading = false;
  isCorrectAnswerChartDataAvailable: boolean = true;
  isIncorrectAnswerChartDataAvailable: boolean = true;

  correctAnswerChart: any;
  incorrectAnswerChart: any;

  correctAnswerChartLabels: string[] = []
  correctAnswerChartData: number[] = []

  incorrectAnswerChartLabels: string[] = []
  incorrectAnswerChartData: number[] = []

  ngOnInit(): void {
    this.loading = false;

    this.authService.getCurrentUser().subscribe(currentUser =>{
      this.userId = currentUser.uid
      this.authService.fetchTestsList().subscribe((allTests: MockTest[]) =>{
        this.allAvailableTests = [];
        allTests.forEach(test =>{
          let temp: MockTestWithAlreadyGiven ={
            'test': test,
            'isAlreadyGiven': false,
            'isBought': true
          }
          this.allAvailableTests.push(temp);
        })

        this.allAvailableTests.forEach(individualTest =>{
          if(individualTest.test.testType === 'Paid'){
            this.authService.checkIfStudentHasBoughtThisTest(this.userId, individualTest.test.id).subscribe(isTestBought =>{
              //not present in the subscription list: so test is not bought
              if(isTestBought=== undefined){
                individualTest.isBought = false;
              }
            })
          }
        })

  
        this.authService.getAllMockTestsGivenByAUser(this.userId).subscribe(allTestsGivenByTheUser =>{
          if(allTestsGivenByTheUser!== undefined){
            if(allTestsGivenByTheUser.allTests.length > 0){
              allTestsGivenByTheUser.allTests.forEach(eachGivenTest =>{
                let testIndex = this.allAvailableTests.findIndex(test => test.test.id === eachGivenTest.testId)
                if(testIndex !== undefined){
                  this.allAvailableTests[testIndex].isAlreadyGiven = true;
                }
              })

              //calculating total no of correct, incorrect questions count
                let allSubjectTestGiven = allTestsGivenByTheUser.allTests.filter(test => test.testCategory ==='Subject')
        
                let allMockTestGiven = allTestsGivenByTheUser.allTests.filter(test => test.testCategory ==='Mock')
                
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
                this.noOfMockTestsGivenByTheUser = unqiueMockTestsIdList.length

                this.noOfCorrectAnswers = 0;
                this.noOfIncorrectAnswers = 0;
                this.noOfQuestionsNotAnswered = 0;

                //prepare data for piechart of correct answers for each subject
                //initializing all subject names with 0 as initial values
                allSubjectTestGiven.forEach(subjectTest =>{
                  this.subjectTagMap[subjectTest.subjectName] = {'correct':0, 'incorrect':0,'not_answered':0}
                })

                allMockTestGiven.forEach(mockTest =>{
                  mockTest.testQuestions.forEach(testQuestion =>{
                    testQuestion.subjectTags?.forEach(subjectTag =>{
                      this.subjectTagMap[subjectTag] = {'correct':0, 'incorrect':0,'not_answered':0}
                    })
                  })
                })

                allSubjectTestGiven.forEach(subjectTest =>{
                  let subjectName = subjectTest.subjectName
                  subjectTest.testQuestions.forEach(testQuestion =>{
                    //option selected
                    if(testQuestion.selectedOption!== null){
                      if(testQuestion.selectedOption === testQuestion.correctAnswer)
                      {
                        this.subjectTagMap[subjectName]['correct'] +=1;
                        this.noOfCorrectAnswers += 1;               
                      }
                      else{
                        this.subjectTagMap[subjectName]['incorrect'] +=1;
                        this.noOfIncorrectAnswers +=1;
                      }
                    }
                    //option not selected
                    else{
                      this.subjectTagMap[subjectName]['not_answered'] +=1;
                      this.noOfQuestionsNotAnswered +=1;
                    }
                  })
                })

                allMockTestGiven.forEach(mockTest =>{
                  mockTest.testQuestions.forEach(testQuestion =>{
                    //option is selected
                    if(testQuestion.selectedOption !== null){
                      if(testQuestion.selectedOption === testQuestion.correctAnswer){
          
                        //increase correct count for each subject type
                        testQuestion.subjectTags?.forEach(subjectTag =>{
                          this.subjectTagMap[subjectTag]['correct'] = this.subjectTagMap[subjectTag]['correct'] === undefined ? 1 : this.subjectTagMap[subjectTag]['correct']+1
                        })
                        this.noOfCorrectAnswers += 1;
                      }
                      else{
                        //increase incorrect count for each subject type
                        testQuestion.subjectTags?.forEach(subjectTag =>{
                          this.subjectTagMap[subjectTag]['incorrect'] = this.subjectTagMap[subjectTag]['incorrect'] === undefined ? 1 : this.subjectTagMap[subjectTag]['incorrect']+1
                        })
                        this.noOfIncorrectAnswers +=1;
                      }
                    }
                    //option is not selected
                    else{
                      //increase not answered count for each topic type
                      testQuestion.subjectTags?.forEach(subjectTag =>{
                        this.subjectTagMap[subjectTag]['not_answered'] = this.subjectTagMap[subjectTag]['not_answered'] === undefined ? 1 : this.subjectTagMap[subjectTag]['not_answered']+1
                      })
                      this.noOfQuestionsNotAnswered +=1;
                    }
                  })
                })
        

                this.totalNoOfQuestions = this.noOfCorrectAnswers + this.noOfIncorrectAnswers + this.noOfQuestionsNotAnswered

                this.correctAnswerChartLabels = [];
                this.correctAnswerChartData = [];

                Object.keys(this.subjectTagMap).forEach((key) =>{
                  this.correctAnswerChartLabels.push(key)
                  this.correctAnswerChartData.push(this.subjectTagMap[key]['correct'])
                })
                
                this.generateRandomColor(this.correctAnswerChartData)

                let isAllDataZero: boolean = true;

                this.correctAnswerChartData.forEach(data =>{
                  if(data > 0){
                    isAllDataZero = false;
                  }
                })
                if(!isAllDataZero){
                  this.isCorrectAnswerChartDataAvailable = true;
                  this.prepareCorrectAnswerPerformanceChart(this.correctAnswerChartLabels, this.correctAnswerChartData, 'overallCorrectAnswersChart', 'Correct Answers')
                }
                else{
                  this.isCorrectAnswerChartDataAvailable = false;
                }

                // labels = [];
                // data = [];

                this.incorrectAnswerChartLabels = [];
                this.incorrectAnswerChartData = [];

                Object.keys(this.subjectTagMap).forEach((key) =>{
                  this.incorrectAnswerChartLabels.push(key)
                  this.incorrectAnswerChartData.push(this.subjectTagMap[key]['incorrect'])
                })

                // this.colors = []
                // this.generateRandomColor(data)
                isAllDataZero = true;
                this.incorrectAnswerChartData.forEach(data =>{
                  if(data > 0){
                    isAllDataZero = false;
                  }
                })

                if(!isAllDataZero){
                  this.isIncorrectAnswerChartDataAvailable = true;

                  this.prepareIncorrectAnswerPerformanceChart(this.incorrectAnswerChartLabels, this.incorrectAnswerChartData, 'overallIncorrectAnswersChart','Incorrect Answers')
                }
                else{
                  this.isIncorrectAnswerChartDataAvailable = false;
                }
                
        
            }
          }
          this.loading = false;
        })
          this.allSubjectTests = this.allAvailableTests.filter(individualTest => individualTest.test.testCategory === 'Subject');
          this.allMockTests = this.allAvailableTests.filter(individualTest => individualTest.test.testCategory ===  'Mock');
          
          this.sortTestList(this.allSubjectTests)
          this.sortTestList(this.allMockTests)
          
          //if length > 4 then remove extra elements and show remaining tests in table
          this.allSubjectTestsForTable = this.allSubjectTests.slice(0, this.initialSubjectTestListFilterLength);
          this.allMockTestsForTable = this.allMockTests.slice(0, this.initialMockTestListFilterLength);      
      })
    })
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

  prepareCorrectAnswerPerformanceChart(chartLabels: string[], chartData: number[], elementId: string, chartTitle: string){

    var data = {
      labels: this.correctAnswerChartLabels,
      datasets: [{
        label: 'Overall Performance',
        data: this.correctAnswerChartData,
        hoverOffset: 4,
        backgroundColor: this.colors
      }]
    };

    //let htmlRef = this.elementRef.nativeElement.querySelector(`#overallCorrectAnswersChart`);
    var overallPerformanceChartEle: any = document.getElementById('overallCorrectAnswersChart')
    if(this.correctAnswerChart){
      this.correctAnswerChart.destroy()
    }
    this.correctAnswerChart = new Chart(
      overallPerformanceChartEle,
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
        }
      }
    );
  }

  prepareIncorrectAnswerPerformanceChart(chartLabels: string[], chartData: number[], elementId: string, chartTitle: string){

    var data = {
      labels: this.incorrectAnswerChartLabels,
      datasets: [{
        label: 'Overall Performance 2',
        data: this.incorrectAnswerChartData,
        hoverOffset: 4,
        backgroundColor: this.colors
      }]
    };

    var overallInCorrectPerformanceChartEle: any = document.getElementById('overallIncorrectAnswersChart')
    if(this.incorrectAnswerChart){
      this.incorrectAnswerChart.destroy()
    }

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
    this.incorrectAnswerChart = new Chart(
      overallInCorrectPerformanceChartEle,
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
        plugins: [plugin]
      }
    );
  }

  ngOnDestroy(): void {
    if(this.correctAnswerChart !== undefined){
      this.correctAnswerChart.destroy()
    }

    if(this.incorrectAnswerChart !== undefined){
      this.incorrectAnswerChart.destroy()
    }
  }

  sortTestList(tests: MockTestWithAlreadyGiven[]){
    tests.sort((a,b) =>{
      if(a.test.testName === b.test.testName){
        return 0
      }
      else if(a.test.testName > b.test.testName){
        return 1
      }
      else{
        return -1
      }
    })
  }

  startTest(test: MockTestWithAlreadyGiven){
    if(test !== undefined){
      this.router.navigate(["/practicetest/testInstructions"], {queryParams: {data: test.test.id, testTime: test.test.totalTime, testCategory: test.test.testCategory}})
    }
  }

  buyTest(indivdualTest: MockTestWithAlreadyGiven){
    this.testsubscriptionService.subscribeToTest(this.userId, indivdualTest.test.id);
    //add student id in the list of students who have bought this test
    this.testsubscriptionService.addStudentToATest(indivdualTest.test.id, this.userId)
    indivdualTest.isBought = true;
  }

  viewMoreMockTest(){
    this.initialMockTestListFilterLength += 2;
    this.allMockTestsForTable = this.allMockTests.slice(0, this.initialMockTestListFilterLength);
    this.sortTestList(this.allMockTestsForTable)
  }

  viewMoreSubjectTest(){
    this.initialSubjectTestListFilterLength += 2;
    this.allSubjectTestsForTable = this.allSubjectTests.slice(0, this.initialSubjectTestListFilterLength);
    this.sortTestList(this.allSubjectTestsForTable)
  }

  viewMockTestReport(test: MockTestWithAlreadyGiven){
    this.router.navigate(["/studentProfile/detailMockTestReport"], {queryParams: {testId: test.test.id}})
  }

  viewSubjectTestReport(test: MockTestWithAlreadyGiven){
    this.router.navigate(["/studentProfile/detailSubjectTestReport"], {queryParams: {testId: test.test.id}})
  }
}
