import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { StudentprofileComponent } from './studentprofile/studentprofile.component'
import { DetailtestreportComponent } from './detailtestreport/detailtestreport.component';
import { ViewmytestsComponent } from './viewmytests/viewmytests.component';
import { EditprofileinfoComponent } from './editprofileinfo/editprofileinfo.component';
import { TestsAnalysisDashboardComponent } from './tests-analysis-dashboard/tests-analysis-dashboard.component';
import { AuthGuard } from '../authentication/auth.guard';
import { StudentAuthGuardGuard } from '../authentication/student-auth-guard.guard';
import { IndividualquestionComponent } from './individualquestion/individualquestion.component';

const routes: Routes = [
  {
    path:'', 
    component: StudentprofileComponent,
    children: [
      { path: 'editprofileinfo', component: EditprofileinfoComponent},
      { path: 'detailTestReport', component: DetailtestreportComponent},
      { path: 'viewMyTests', component: ViewmytestsComponent},
      { path: 'testsAnalysisDashboard', component: TestsAnalysisDashboardComponent},
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
