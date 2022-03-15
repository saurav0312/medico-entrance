import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TeacherAuthGuardGuard } from '../authentication/teacher-auth-guard.guard';
import { QuestionAnswerDiscussionComponent } from '../student/question-answer-discussion/question-answer-discussion.component';
import { AddmocktestComponent } from './addmocktest/addmocktest.component';
import { EditmocktestComponent } from './editmocktest/editmocktest.component';
import { MyMockTestsComponent } from './my-mock-tests/my-mock-tests.component';
import { MyTestsBoughtByAStudentComponent } from './my-tests-bought-by-astudent/my-tests-bought-by-astudent.component';
import { MystudentsComponent } from './mystudents/mystudents.component';
import { TeacherProfileComponent } from './teacher-profile/teacher-profile.component';
import { TeacherdashboardcontentComponent } from './teacherdashboardcontent/teacherdashboardcontent.component';
import { TeacherdashboardhomeComponent } from './teacherdashboardhome/teacherdashboardhome.component';
import { TeacherprofileinfoComponent } from './teacherprofileinfo/teacherprofileinfo.component';

const routes: Routes = [
  {
    path:'', 
    component: TeacherdashboardhomeComponent,
    children: [
      { path: 'teacherdashboardcontent', component: TeacherdashboardcontentComponent },
      { path: 'addtest', component: AddmocktestComponent },
      { path: 'modifytest', component: MyMockTestsComponent },
      { path: 'editmocktest', component: EditmocktestComponent },
      { path: 'questionAnswerDiscussion', component: QuestionAnswerDiscussionComponent},
      { path: 'viewmystudents', component: MystudentsComponent },
      { path: 'editprofileinfo', component: TeacherprofileinfoComponent},
      { path: 'myTestsBoughtByAStudent', component: MyTestsBoughtByAStudentComponent },
      { path: '', redirectTo:'/teacherdashboard/teacherdashboardcontent', pathMatch: 'full' }
    ],
    canActivate: [ TeacherAuthGuardGuard]
  },
  { 
    path: 'teacherProfile', 
    component: TeacherProfileComponent,
    children: [
      { path: 'editprofileinfo', component: TeacherprofileinfoComponent},
      { path: '', redirectTo:'/teacherdashboard/teacherProfile/editprofileinfo', pathMatch: 'full' }
    ],
    canActivate: [ TeacherAuthGuardGuard]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TeacherdashboardRoutingModule { }
