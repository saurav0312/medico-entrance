import { Component, OnInit } from '@angular/core';
import { GoogleChartInterface, GoogleChartType } from 'ng2-google-charts';
import { TestReportData } from 'src/app/interface/testReportData';
import { Tests } from 'src/app/interface/tests';
import { AuthService } from '../../service/auth.service';

declare var google: any;

@Component({
  selector: 'app-tests-analysis-dashboard',
  templateUrl: './tests-analysis-dashboard.component.html',
  styleUrls: ['./tests-analysis-dashboard.component.css']
})
export class TestsAnalysisDashboardComponent implements OnInit {

  testReportData! : TestReportData;
  allTestsGivenByUser!: Tests[] ;
  singleTest!: Tests;
  subjectTags: Array<string> = [];
  topicTags: Array<string> = [];
  

  subjectTagPiechartData: any = []
  topicTagPiechartData: any = []

  subjectTagMap = new Map();
  topicTagMap = new Map();

  constructor(
    private authService: AuthService
  ) { }

  ngOnInit(): void {

    // google.charts.load('current', {packages: ['corechart']});
    
    // let sub = this.authService.getCurrentUser().subscribe(response =>{
    //   this.authService.getAllMockTestsGivenByAUser(response?.uid).subscribe(response =>{
    //     sub.unsubscribe()
    //     if(response!== undefined){
    //       this.testReportData = response
    //       console.log("All given tests response: ", response)
    //       this.allTestsGivenByUser = this.testReportData.allTests
    //       this.singleTest = this.allTestsGivenByUser[0]
    //       //maintain subject tags and topic tags array
    //       this.singleTest.testQuestions.forEach(testQuestion =>{
    //         if(testQuestion.subjectTags?.length !== 0){
    //           testQuestion.subjectTags?.forEach(subjectTag =>{
    //             if(this.subjectTags.length === 0 ){
    //               this.subjectTags.push(subjectTag)
    //             }
    //             else if(this.subjectTags.findIndex( ele => ele === subjectTag) === -1){
    //               this.subjectTags.push(subjectTag)
    //             }
    //           })
    //         }
            

    //         if(testQuestion.topicTags?.length !== 0){
    //           testQuestion.topicTags?.forEach(topicTag =>{
    //             if(this.topicTags.length === 0 ){
    //               this.topicTags.push(topicTag)
    //             }
    //             else if(this.topicTags.findIndex( ele => ele === topicTag) === -1){
    //               this.topicTags.push(topicTag)
    //             }
    //           })
    //         }
    //       })
    //       console.log("Subject Tags: ", this.subjectTags)
    //       console.log("Topic Tags: ", this.topicTags)


    //       //counting correct questions based on subject tags
    //       this.singleTest.testQuestions.forEach(testQuestion =>{
    //         if(testQuestion.selectedOption !== null && testQuestion.selectedOption === testQuestion.correctAnswer){
    //           testQuestion.subjectTags?.forEach(subjectTag =>{
    //             if(this.subjectTagMap.has(subjectTag) == false){
    //               this.subjectTagMap.set(subjectTag,1)
    //             }
    //             else{
    //               this.subjectTagMap.set(subjectTag, this.subjectTagMap.get(subjectTag)+1)
    //             }
    //           })
    //         }
    //       })
    //       this.subjectTags.forEach(subjectTag =>{
    //         if(this.subjectTagMap.has(subjectTag) == false){
    //           this.subjectTagMap.set(subjectTag, 0);
    //         }
    //       })


    //       //counting correct questions based on topic tags
    //       this.singleTest.testQuestions.forEach(testQuestion =>{
    //         if(testQuestion.selectedOption !== null && testQuestion.selectedOption === testQuestion.correctAnswer){
    //           testQuestion.topicTags?.forEach(topicTag =>{
    //             if(this.topicTagMap.has(topicTag) == false){
    //               this.topicTagMap.set(topicTag,1)
    //             }
    //             else{
    //               this.topicTagMap.set(topicTag, this.topicTagMap.get(topicTag)+1)
    //             }
    //           })
    //         }
    //       })


    //       console.log("SubjectTag Map: ", this.subjectTagMap)
    //       console.log("TopicTag Map: ", this.topicTagMap)

          
    //       for (let entry of this.subjectTagMap.entries()) {
    //         console.log(entry[0], entry[1]);
    //         let temppiechartData = [];
    //         temppiechartData.push(entry[0]);
    //         temppiechartData.push(entry[1]);
    //         this.subjectTagPiechartData.push(temppiechartData)
    //       }

    //       for (let entry of this.topicTagMap.entries()) {
    //         console.log(entry[0], entry[1]);
    //         let temppiechartData = [];
    //         temppiechartData.push(entry[0]);
    //         temppiechartData.push(entry[1]);
    //         this.topicTagPiechartData.push(temppiechartData)
    //       }

    //       google.charts.setOnLoadCallback(this.drawChart(this.subjectTagPiechartData, this.topicTagPiechartData));
    //     }
    //   })
    // })
  }

  // drawChart(subjectTagPiechartData : any, topicTagPiechartData: any){
  //   // Create the data table
  //   var subjectTagData = new google.visualization.DataTable();
  //   subjectTagData.addColumn('string', 'Question Category');
  //   subjectTagData.addColumn('number', 'No of Correct Questions Answered');
  //   subjectTagData.addRows(subjectTagPiechartData);

  //   let subjectTagOptions = {
  //     title: 'Student Test Analysis Based on Subject',
  //     is3D: true,
  //   }

  //   var topicTagData = new google.visualization.DataTable();
  //   topicTagData.addColumn('string', 'Question Category');
  //   topicTagData.addColumn('number', 'No of Correct Questions Answered');
  //   topicTagData.addRows(topicTagPiechartData);

  //   let topicTagOptions = {
  //     title: 'Student Test Analysis Based on Topic',
  //     is3D: true,
  //   }

  //   // Instantiate and draw our chart, passing in some options.
  //   var subject_chart_div = document.getElementById('subject_chart_div');
  //   var subjectTagChart = new google.visualization.PieChart(subject_chart_div);
  //   var topicTagChart = new google.visualization.PieChart(document.getElementById('topic_chart_div'));
    
  //   subjectTagChart.draw(subjectTagData, subjectTagOptions);
  //   topicTagChart.draw(topicTagData, topicTagOptions);
    
  // }

}
