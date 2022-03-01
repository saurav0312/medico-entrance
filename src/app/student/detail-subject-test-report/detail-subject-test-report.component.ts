import { Component, OnInit, ViewChild, AfterViewInit, Input, ElementRef } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
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
  selector: 'app-detail-subject-test-report',
  templateUrl: './detail-subject-test-report.component.html',
  styleUrls: ['./detail-subject-test-report.component.css']
})
export class DetailSubjectTestReportComponent implements OnInit {

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
  @ViewChild('content') content!: ElementRef;


  displayedColumns = [
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
          this.testReportData.allTests = this.testReportData.allTests.filter(test => test.testCategory ==='Subject')
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

          if(this.allTests.length > 0 && this.allTests[0].children !== undefined){
            this.defaultSelectedTest = this.allTests[0].children[0]
            let nodeData ={
              'node': this.defaultSelectedTest
            }
            console.log("Node data: ", nodeData)
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
  }

  

  ngAfterViewInit(): void {
    
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
