import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { StudentprofileComponent } from './studentprofile/studentprofile.component'
import { DetailtestreportComponent } from './detailtestreport/detailtestreport.component';
import { EditprofileinfoComponent } from './editprofileinfo/editprofileinfo.component';
import { StudentAuthGuardGuard } from '../authentication/student-auth-guard.guard';
import { IndividualquestionComponent } from './individualquestion/individualquestion.component';
import { StudentPerformanceAnalysisDashboardComponent } from './student-performance-analysis-dashboard/student-performance-analysis-dashboard.component';
import { DetailSubjectTestReportComponent } from './detail-subject-test-report/detail-subject-test-report.component';
import { QuestionAnswerDiscussionComponent } from './question-answer-discussion/question-answer-discussion.component';
import { StudentPageHomeComponent } from './student-page-home/student-page-home.component';
import { StudentdashboardcontentComponent } from '../studentdashboard/studentdashboardcontent/studentdashboardcontent.component';
import { MyDashboardComponent } from './my-dashboard/my-dashboard.component';
import { AllTestsByATeacherComponent } from '../studentdashboard/all-tests-by-ateacher/all-tests-by-ateacher.component';

const routes: Routes = [
  {
    path:'', 
    component: StudentprofileComponent,
    children: [
      { path: 'studentPageHome', component: StudentPageHomeComponent},
      { path: 'editprofileinfo', component: EditprofileinfoComponent},
      { path: 'viewAllTeachers', component: StudentdashboardcontentComponent},
      { path: 'testsByATeacher', component: AllTestsByATeacherComponent},
      { path: 'detailMockTestReport', component: DetailtestreportComponent},
      { path: 'detailSubjectTestReport', component: DetailSubjectTestReportComponent},
      { path: 'questionAnswerDiscussion', component: QuestionAnswerDiscussionComponent},
      { path: 'overallAnalysisDashboard', component: StudentPerformanceAnalysisDashboardComponent},
      { path: 'myDashboard', component: MyDashboardComponent},
      { path: 'individualQuestion', component: IndividualquestionComponent },
      { path: '', redirectTo: '/studentProfile/studentPageHome', pathMatch: 'full' },
    ],
    canActivate: [StudentAuthGuardGuard]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class StudentRoutingModule { }
