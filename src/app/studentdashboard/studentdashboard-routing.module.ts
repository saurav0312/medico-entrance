import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { StudentAuthGuardGuard } from '../authentication/student-auth-guard.guard';
import { StudentdashboardhomeComponent } from './studentdashboardhome/studentdashboardhome.component';
import { AllTestsByATeacherComponent } from './all-tests-by-ateacher/all-tests-by-ateacher.component';
import { StudentdashboardcontentComponent } from './studentdashboardcontent/studentdashboardcontent.component';
import { PerformancereportComponent } from './performancereport/performancereport.component';

const routes: Routes = [
  {
    path:'', 
    component: StudentdashboardhomeComponent,
    children: [
      {
        path: 'allTeachers',
        component: StudentdashboardcontentComponent
      },
      {
        path: 'performancereport',
        component: PerformancereportComponent
      },
      {
        path: '',
        redirectTo:'/studentdashboard/performancereport',
        pathMatch: 'full'
      }
    ],
    canActivate: [ StudentAuthGuardGuard]
  },
  { 
    path: 'testsByATeacher', 
    component: AllTestsByATeacherComponent,
    canActivate: [ StudentAuthGuardGuard]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class StudentdashboardRoutingModule { }
