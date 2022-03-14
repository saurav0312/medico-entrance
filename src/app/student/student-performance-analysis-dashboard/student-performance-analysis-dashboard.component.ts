import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Chart } from 'chart.js'
import { Observable } from 'rxjs';
import { MockTest } from 'src/app/interface/mockTest';
import { StudentsOfTest } from 'src/app/interface/students-of-test';
import { TestIdWithName } from 'src/app/interface/test-id-with-name';
import { TestSubscription } from 'src/app/interface/test-subscription';
import { AuthService } from 'src/app/service/auth.service';
import { TestsubscriptionService } from 'src/app/service/testsubscription.service';

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
  userId: string = '';
  isFirstSubscription: boolean = true;
  allSubscribedTests: Array<string | undefined> =[];
  allTestsList: MockTest[] = [];
  isFirstStudent: boolean = true;

  constructor(
    private authService: AuthService,
    private router: Router,
    private testsubscriptionService: TestsubscriptionService
  ) { }

  ngOnInit(): void {
    this.loading = true;

    this.authService.getCurrentUser().subscribe(currentUser =>{
      this.userId = currentUser.uid

      this.authService.getAllMockTestsGivenByAUser(this.userId).subscribe(allMockTestsGivenByUser =>{
        let totalNumberOfTestsGiven = allMockTestsGivenByUser.allTests.length
        let allSubjectTestGiven = allMockTestsGivenByUser.allTests.filter(test => test.testCategory ==='Subject')

        let allMockTestGiven = allMockTestsGivenByUser.allTests.filter(test => test.testCategory ==='Mock')
        
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
      },
      error =>{
        window.alert(error.error)
        this.loading = false;
      })

      //fetch all subscribed tests by the user
      this.testsubscriptionService.getAllSubscribedTestsByAUser(this.userId).subscribe((response:TestSubscription) =>{
        if(response !== undefined){
          this.allSubscribedTests = response.allSubscribedTests
          this.isFirstSubscription = false;
        }

        //fetch all mock and subject tests
        this.fetchTestsList().subscribe((allTests: MockTest[]) =>{
          this.allTestsList = allTests
          if(this.allTestsList.length > 0 && this.allSubscribedTests.length > 0){
            this.allTestsList.forEach(test =>{
              if(this.allSubscribedTests.findIndex(subscribedTest => subscribedTest === test.id) !== -1){
                test.isBought = true;
              }
            })
          }

        this.allSubjectTestsList = this.allTestsList.filter(test => test.testCategory === 'Subject');
  
        
        this.listOfMockTests = this.allTestsList.filter(test => test.testCategory === 'Mock');
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
  
        
        if(this.allSubjectTestsList!== undefined && this.allSubjectTestsList.length > 0){
          this.allSubjectTestsList.forEach((subjectTest:MockTest) =>{
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



      })
    },
    error =>{
      window.alert(error.error)
      this.loading = false;
    })
  }

  fetchTestsList(): Observable<any>{
    return this.authService.fetchTestsList();
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
    //let test: MockTest| undefined = this.allSubjectTestsList.find(test => test.id === testIdMap.testId)
    if(test !== undefined){
      this.router.navigate(["/practicetest/testInstructions"], {queryParams: {data: test.id, testTime: test.totalTime, testCategory: "Subject"}})
    }
  }

  buySubjectTest(testId: string | undefined) : void{
    const data: TestSubscription ={
      allSubscribedTests: [testId]
    }
    this.testsubscriptionService.subscribeToTest(this.userId, data, this.isFirstSubscription);
    this.listOfSubjectTests.forEach(test =>{
      if(test.id === testId){
        test.isBought = true;
      }
    })

    this.addStudentToTestList(testId);
    
  }

  buyMockTest(testId: string | undefined): void{
    const data: TestSubscription ={
      allSubscribedTests: [testId]
    }
    this.testsubscriptionService.subscribeToTest(this.userId, data, this.isFirstSubscription);
    this.listOfMockTests.forEach(test =>{
      if(test.id === testId){
        test.isBought = true;
      }
    })

    this.addStudentToTestList(testId);
  }

  addStudentToTestList(testId: string | undefined){
    const studentData : StudentsOfTest ={
      allStudentsOfTheTest : [this.userId]
    }

    const sub = this.testsubscriptionService.getAllStudentsOfATest(testId).subscribe(response =>{
      if(response !== undefined){
        this.isFirstStudent = false;
      }
      else{
        this.isFirstStudent = true;
      }
      sub.unsubscribe()
      this.testsubscriptionService.addStudentToATest(testId, studentData, this.isFirstStudent)
    })
  }
}
