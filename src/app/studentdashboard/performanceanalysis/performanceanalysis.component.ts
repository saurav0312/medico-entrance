import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-performanceanalysis',
  templateUrl: './performanceanalysis.component.html',
  styleUrls: ['./performanceanalysis.component.scss']
})
export class PerformanceanalysisComponent implements OnInit {

  cardContents : Array<{[key: string] : string}> =[
    {
      'title': "Mock Test",
      'description': "Practice with our standardized mock tests.",
      'url': '/practicetest',
      'imageName': '../../assets/img/student_home_page.jpg' 
    },
    {
      'title': "Subject Test",
      'description': "Test your performance in each subjects.",
      'url': '#',
      'imageName': '../../assets/img//student_home_page.jpg' 
    },
    {
      'title': "My Dashboard",
      'description': "View your overall performance report on each tests.",
      'url': '/studentdashboard/performancereport',
      'imageName': '../../assets/img/student_home_page.jpg' 
    }
  ];

  constructor() { }

  ngOnInit(): void {
  }

}
