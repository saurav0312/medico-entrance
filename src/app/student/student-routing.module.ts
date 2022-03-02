import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { StudentprofileComponent } from './studentprofile/studentprofile.component'
import { DetailtestreportComponent } from './detailtestreport/detailtestreport.component';
import { ViewmytestsComponent } from './viewmytests/viewmytests.component';
import { EditprofileinfoComponent } from './editprofileinfo/editprofileinfo.component';
import { AuthGuard } from '../authentication/auth.guard';
import { StudentAuthGuardGuard } from '../authentication/student-auth-guard.guard';
import { IndividualquestionComponent } from './individualquestion/individualquestion.component';
import { StudentPerformanceAnalysisDashboardComponent } from './student-performance-analysis-dashboard/student-performance-analysis-dashboard.component';
import { DetailSubjectTestReportComponent } from './detail-subject-test-report/detail-subject-test-report.component';
import { QuestionAnswerDiscussionComponent } from './question-answer-discussion/question-answer-discussion.component';

const routes: Routes = [
  {
    path:'', 
    component: StudentprofileComponent,
    children: [
      { path: 'editprofileinfo', component: EditprofileinfoComponent},
      { path: 'detailMockTestReport', component: DetailtestreportComponent},
      { path: 'detailSubjectTestReport', component: DetailSubjectTestReportComponent},
      { path: 'questionAnswerDiscussion', component: QuestionAnswerDiscussionComponent},
      { path: 'viewMyTests', component: ViewmytestsComponent},
      { path: 'overallAnalysisDashboard', component: StudentPerformanceAnalysisDashboardComponent},
      { path: 'individualQuestion', component: IndividualquestionComponent },
      { path: '', redirectTo: '/studentProfile/editprofileinfo', pathMatch: 'full' },
    ],
    canActivate: [StudentAuthGuardGuard]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class StudentRoutingModule { }
