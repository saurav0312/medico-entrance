import { Component, OnInit } from '@angular/core';
import { IPerformance } from 'src/app/interface/performance';
import { TestReportData } from 'src/app/interface/testReportData';
import { AuthService } from 'src/app/service/auth.service';
import  Chart from 'chart.js/auto'
import screenfull from 'screenfull';
import { SubjectList } from 'src/app/interface/subject-list';

@Component({
  selector: 'app-my-dashboard',
  templateUrl: './my-dashboard.component.html',
  styleUrls: ['./my-dashboard.component.css']
})
export class MyDashboardComponent implements OnInit {

  testReportData! : TestReportData;

  subjectTagMap: {[key:string]:{[key:string]:number}} ={};
  topicTagMap: {[key:string]:{[key:string]:number}} ={};
  subjectTagBarGraphData: any = []
  topicTagBarGraphData: any = []

  subjectWiseTimeSpent = new Map();
  topicWiseTimeSpent = new Map();
  subjectWiseTimeSpentPiechartData: any = []
  topicWiseTimeSpentPiechartData: any = []

  subjectThresholdValue: number = 20;
  topicThresholdValue: number = 20;

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

  success: number =0;

  subjectNameList: string[] = [];
  topicNameList: string[] = [];

  subjectWiseCorrectAnswersData: number[] = [];
  subjectWiseIncorrectAnswersData: number[] = [];
  subjectWiseNotAnsweredData: number[] = [];

  topicWiseCorrectAnswersData: number[] = [];
  topicWiseIncorrectAnswersData: number[] = []
  topicWiseNotAnsweredData: number[] = []

  colors: string[] = [];

  subjectWiseChart: any;
  topicWiseChart: any;

  subjectWiseTimeSpentChart: any;
  topicWiseTimeSpentChart: any;

  selectedSubjectInTopicWiseBargraph: string = '';
  selectedSubjectInTopicWisePiechart: string = '';
  previouslySelectedSubjectInTopicWiseBargraph: string = '';
  previouslySelectedSubjectInTopicWisePiechart: string = ''
  subjectListDropdownOptions: SubjectList[] = [];

  subjectNameWithTopicsMap: {[key:string]:string[]} ={};
  isNewUser: boolean = false;

  constructor(
    private authService: AuthService
  ) { }

  ngOnInit(): void {

    let sub = this.authService.getCurrentUser().subscribe((userResponse:any) =>{
      this.authService.getAllMockTestsGivenByAUser(userResponse?.uid).subscribe( (allGivenTestsData:any) =>{
        sub.unsubscribe()
        console.log("All tetststs: ", allGivenTestsData)
        if(allGivenTestsData!== undefined){
          this.testReportData = allGivenTestsData
          this.prepareData()
        }
        else{
          this.isNewUser = true;
        }
      })
    })
  }

  prepareData(){
    if(this.testReportData !== undefined){
      
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

      let allSubjectTestGiven = this.testReportData.allTests.filter(test => test.testCategory ==='Subject')
      
      let allMockTestGiven = this.testReportData.allTests.filter(test => test.testCategory ==='Mock')

      //prepare data for graph
      //initializing all subject names with 0 as initial values
      allSubjectTestGiven.forEach(subjectTest =>{
        this.subjectTagMap[subjectTest.subjectName] = {'correct':0, 'incorrect':0,'not_answered':0}
      })

      allMockTestGiven.forEach(mockTest =>{
        mockTest.testQuestions.forEach(testQuestion =>{

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

          console.log("Subject with topic list: ", this.subjectNameWithTopicsMap)
  
          testQuestion.topicTags?.forEach(topicTag =>{
            this.topicTagMap[topicTag] ={'correct':0, 'incorrect':0,'not_answered':0}
          })
        })
      })

      
      allSubjectTestGiven.forEach(subjectTest =>{
        subjectTest.testQuestions.forEach(testQuestion =>{

          //calculate time spent on the question based on subject
          let subjectName = subjectTest.subjectName
          if(this.subjectWiseTimeSpent.has(subjectName) == false){
            this.subjectWiseTimeSpent.set(subjectName,testQuestion.totalTimeSpent)
          }
          else{
            this.subjectWiseTimeSpent.set(subjectName, this.subjectWiseTimeSpent.get(subjectName)+testQuestion.totalTimeSpent)
          }

          //calculate correct, incorrect and not answered count of each subject questions
          if(testQuestion.selectedOption !== null){
            //question has been answered
            if(testQuestion.selectedOption === testQuestion.correctAnswer){
  
              //increase correct count for each subject type
              this.subjectTagMap[subjectName]['correct'] = this.subjectTagMap[subjectName]['correct'] === undefined ? 1 : this.subjectTagMap[subjectName]['correct']+1
            }
            else{
              //increase incorrect count for each subject type
              this.subjectTagMap[subjectName]['incorrect'] = this.subjectTagMap[subjectName]['incorrect'] === undefined ? 1 : this.subjectTagMap[subjectName]['incorrect']+1
            }
          }
          else{
            //increase not answered count for each subject type
            this.subjectTagMap[subjectName]['not_answered'] = this.subjectTagMap[subjectName]['not_answered'] === undefined ? 1 : this.subjectTagMap[subjectName]['not_answered']+1
          }
        })
      })

      allMockTestGiven.forEach(mockTest =>{
        mockTest.testQuestions.forEach(testQuestion =>{
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
      })

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
          'successPercent': Math.round(successPercent)
        }

        if(Math.round(successPercent) > this.subjectThresholdValue){
          this.strongSubjectList['strongSubject'].push(tempSuccessValue)
        }
        else{
          this.weakSubjectList['weakSubject'].push(tempSuccessValue)
        }

        // if(this.subjectTagMap[key]['correct'] >= this.subjectThresholdValue){

        //   this.strongSubjectList['strongSubject'].push(tempSuccessValue)
        // }
        // else{
        //   this.weakSubjectList['weakSubject'].push(tempSuccessValue)
        // }

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
          'successPercent': Math.round(successPercent)
        }

        if(Math.round(successPercent) > this.topicThresholdValue){
          this.strongTopicList['strongTopic'].push(tempSuccessValue)
        }
        else{
          this.weakTopicList['weakTopic'].push(tempSuccessValue)
        }

        // if(this.topicTagMap[key]['correct'] >= this.topicThresholdValue){
        //   this.strongTopicList['strongTopic'].push(tempSuccessValue)
        // }
        // else{
        //   this.weakTopicList['weakTopic'].push(tempSuccessValue)
        // }
      })

      this.strongSubjectList.strongSubject = this.strongSubjectList.strongSubject.slice(0,3)
      this.weakSubjectList.weakSubject = this.weakSubjectList.weakSubject.slice(0,3)
      this.strongTopicList.strongTopic = this.strongTopicList.strongTopic.slice(0,3)
      this.weakTopicList.weakTopic = this.weakTopicList.weakTopic.slice(0,3)


      console.log("Strong subject: ", this.strongSubjectList)
      console.log("weak subject list: ", this.weakSubjectList)
      console.log("Strong topics: ", this.strongTopicList)
      console.log("weak topic list: ", this.weakTopicList)

      

      console.log("Subject Lists: ", this.subjectTagMap)
      console.log("Topics Lists: ", this.topicTagMap)
      console.log("Subjectwise time spent: ", this.subjectWiseTimeSpent)
      console.log("Topicwise time spent: ", this.topicWiseTimeSpent)
      console.log("SubjectWise chart correctanswer data: ", this.subjectWiseCorrectAnswersData)

      this.prepareSubjectWiseBarGraph()
      this.prepareTopicWiseBarGraph()

      let labels: string[] = [];
      let data: number[] = [];
      console.log("SUbject wise time after: ", this.subjectWiseTimeSpent)
      
      for (let entry of this.subjectWiseTimeSpent.entries()){
        labels.push(entry[0])
        data.push(entry[1])
      }
      
      // console.log("Timespwnet keys: ",Object.keys(this.subjectWiseTimeSpent))
      // Object.keys(this.subjectWiseTimeSpent).forEach((key) =>{
      //   console.log("curr key: ", key)
      //   labels.push(key)
      //   data.push(this.subjectWiseTimeSpent.get(key))
      // })

      console.log("Piechart albel: ", labels)
      console.log("SUbjectwise pie chart time: ", data)

      this.generateRandomColor(data)
      this.prepareSubjectWiseTimeSpentChart(labels, data, 'subjectWiseTimeSpentChart' , 'Subjectwise Time Spent Chart')


      labels = [];
      data = [];
      console.log("SUbject wise time after: ", this.topicWiseTimeSpent)
      
      for (let entry of this.topicWiseTimeSpent.entries()){
        labels.push(entry[0])
        data.push(entry[1])
      }

      this.generateRandomColor(data)
      this.prepareTopicWiseTimeSpentChart(labels, data, 'topicWiseTimeSpentChart' , 'Topicwise Time Spent Chart')

      //This is for default value of chart dropdown. will use it later
      // let event :any ={
      //   'target':{
      //     'textContent': this.subjectListDropdownOptions[0].name 
      //   }
      // }

      // this.selectedSubjectInTopicWisePiechart = this.subjectListDropdownOptions[0].name
      // this.subjectSelectedForTopicWiseTimeSpentChart(event)

      const subjectwise_chart : any = document.getElementById('subjectWiseChart');
      const topicwise_chart : any = document.getElementById('topicWiseChart');
      const subjectwisetimespent_piechart : any = document.getElementById('subjectWiseTimeSpentChart');
      const topicwisetimespent_piechart : any = document.getElementById('topicWiseTimeSpentChart');

      const buttonElement1 :any = document.getElementById('fullScreen1')
      buttonElement1.addEventListener('click', () => {
        if (screenfull.isEnabled) {
          screenfull.request(subjectwise_chart);
          //this.prepareSubjectWiseBarGraph()
        }
      });

      const buttonElement2 :any = document.getElementById('fullScreen2')
      buttonElement2.addEventListener('click', () => {
        if (screenfull.isEnabled) {
          screenfull.request(topicwise_chart);
          //this.prepareTopicWiseBarGraph()
        }
      });

      const buttonElement3 :any = document.getElementById('fullScreen3')
      buttonElement3.addEventListener('click', () => {
        if (screenfull.isEnabled) {
          screenfull.request(subjectwisetimespent_piechart);
          //this.prepareTopicWiseBarGraph()
        }
      });

      const buttonElement4 :any = document.getElementById('fullScreen4')
      buttonElement4.addEventListener('click', () => {
        if (screenfull.isEnabled) {
          screenfull.request(topicwisetimespent_piechart);
          //this.prepareTopicWiseBarGraph()
        }
      });
    }
  }


  subjectSelectedForTopicWiseChart(event: any){
    console.log("SUbject seel: ", event.target.textContent)
    let subjectName = event.target.textContent
    console.log("Suu: ", this.subjectNameWithTopicsMap[subjectName])
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

      // this.prepareTopicWiseBarGraph()
      console.log("Topic wiwiwi corr: ", this.topicWiseCorrectAnswersData)
      console.log("Topic wiwiwi incorr: ", this.topicWiseIncorrectAnswersData)
      console.log("Topic wiwiwi not: ", this.topicWiseNotAnsweredData)
      //this.topicWiseChart.update()
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

    console.log("SUbject seel for timespent: ", event.target.textContent)
    let subjectName = event.target.textContent
    console.log("Suu timespent: ", this.subjectNameWithTopicsMap[subjectName])
    if(subjectName !== undefined && subjectName !== this.previouslySelectedSubjectInTopicWisePiechart){
      let topicList: string[] = this.subjectNameWithTopicsMap[subjectName]

      //this.topicWiseChart.update()
      this.removeData(this.topicWiseTimeSpentChart)

      

      //check

      let labels = [];
      let pieChartData = [];
      console.log("SUbject wise time after: ", this.topicWiseTimeSpent)
      
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
      //this.prepareTopicWiseTimeSpentChart(labels, pieChartData, 'topicWiseTimeSpentChart' , 'Topicwise Time Spent Chart')
    }
  }


  addData(chart:any, data: any) {
    // chart.data.labels.push(label);
    // chart.data.datasets.forEach((dataset:any) => {
    //     dataset.data.push(data);
    // });

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

  downloadSubjectWiseChartImage(){
    var a = document.createElement('a');
    a.href = this.subjectWiseChart.toBase64Image();
    a.download = 'my_file_name.png';

    // Trigger the download
    a.click();
  }

  downloadTopicWiseChartImage(){
    var a = document.createElement('a');
    a.href = this.topicWiseChart.toBase64Image();
    a.download = 'my_file_name.png';

    // Trigger the download
    a.click();
  }

  downloadSubjectWiseTimeSpentChartImage(){
    var a = document.createElement('a');
    a.href = this.subjectWiseTimeSpentChart.toBase64Image();
    a.download = 'my_file_name.png';

    // Trigger the download
    a.click();
  }

  downloadTopicWiseTimeSpentChartImage(){
    var a = document.createElement('a');
    a.href = this.topicWiseTimeSpentChart.toBase64Image();
    a.download = 'my_file_name.png';

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

    var subjectWiseChartEle: any = document.getElementById('subjectWiseChart')
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

    var topicWiseChartEle: any = document.getElementById('topicWiseChart')
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

}
