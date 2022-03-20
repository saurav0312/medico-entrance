import { formatDate } from '@angular/common';
import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { Timestamp } from 'firebase/firestore';
import { TreeNode } from 'primeng/api';
import { IPerformance } from 'src/app/interface/performance';
import { TestReportData } from 'src/app/interface/testReportData';
import { TestReportQuestion } from 'src/app/interface/testReportQuestion';
import { Tests } from 'src/app/interface/tests';
import { AuthService } from 'src/app/service/auth.service';
import { IndividualquestionComponent } from 'src/app/student/individualquestion/individualquestion.component';

@Component({
  selector: 'app-view-subject-test-history-of-astudent-on-atest',
  templateUrl: './view-subject-test-history-of-astudent-on-atest.component.html',
  styleUrls: ['./view-subject-test-history-of-astudent-on-atest.component.css']
})
export class ViewSubjectTestHistoryOfAStudentOnATestComponent implements OnInit {

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
  @ViewChild('content') content!: ElementRef;


  displayedColumns = [
    { field: 'result', header: 'Result' },
    { field: 'totalTimeSpent', header: 'Time Spent' },
  ];

  allTests: TreeNode[] = [];
  uniqueTestsList: {[key:string]: Array<any>} = {};
  testReportData! : TestReportData;
  defaultSelectedTest!: TreeNode;

  isNewUser: boolean = false;


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
    this.totalScore =0;
    this.singleTest.testQuestions.forEach(question =>{
      if(question.selectedOption !== null){
        if(question.selectedOption === question.correctAnswer){
          this.totalScore += 1;
        }
      }
    })
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
