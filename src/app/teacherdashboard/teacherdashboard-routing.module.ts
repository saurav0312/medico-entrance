import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TeacherAuthGuardGuard } from '../authentication/teacher-auth-guard.guard';
import { QuestionAnswerDiscussionComponent } from '../student/question-answer-discussion/question-answer-discussion.component';
import { AddmocktestComponent } from './addmocktest/addmocktest.component';
import { EditmocktestComponent } from './editmocktest/editmocktest.component';
import { MyMockTestsComponent } from './my-mock-tests/my-mock-tests.component';
import { MyTestsBoughtByAStudentComponent } from './my-tests-bought-by-astudent/my-tests-bought-by-astudent.component';
import { MystudentsComponent } from './mystudents/mystudents.component';
import { TeacherdashboardhomeComponent } from './teacherdashboardhome/teacherdashboardhome.component';
import { TeacherprofileinfoComponent } from './teacherprofileinfo/teacherprofileinfo.component';
import { ViewAllStudentsOfAtestComponent } from './view-all-students-of-atest/view-all-students-of-atest.component';
import { ViewSubjectTestHistoryOfAStudentOnATestComponent } from './view-subject-test-history-of-astudent-on-atest/view-subject-test-history-of-astudent-on-atest.component';
import { ViewTestHistoryOfAStudentOnATestComponent } from './view-test-history-of-astudent-on-atest/view-test-history-of-astudent-on-atest.component';

const routes: Routes = [
  {
    path:'', 
    component: TeacherdashboardhomeComponent,
    children: [
      { path: 'teacherdashboardcontent', component: MystudentsComponent },
      { path: 'addtest', component: AddmocktestComponent },
      { path: 'modifytest', component: MyMockTestsComponent },
      { path: 'editmocktest', component: EditmocktestComponent },
      { path: 'questionAnswerDiscussion', component: QuestionAnswerDiscussionComponent},
      { path: 'viewmystudents', component: MystudentsComponent },
      { path: 'editprofileinfo', component: TeacherprofileinfoComponent},
      { path: 'myTestsBoughtByAStudent', component: MyTestsBoughtByAStudentComponent },
      { path: 'viewAllStudentsOfATest', component: ViewAllStudentsOfAtestComponent },
      { path: 'viewTestHistoryOfStudentOnThisTest', component: ViewTestHistoryOfAStudentOnATestComponent },
      { path: 'viewSubjectTestHistoryOfStudentOnThisTest', component: ViewSubjectTestHistoryOfAStudentOnATestComponent },
      { path: '', redirectTo:'/teacherdashboard/teacherdashboardcontent', pathMatch: 'full' }
    ],
    canActivate: [ TeacherAuthGuardGuard]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TeacherdashboardRoutingModule { }
