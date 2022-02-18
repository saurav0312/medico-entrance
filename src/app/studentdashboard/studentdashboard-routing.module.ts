import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '../authentication/auth.guard';
import { StudentAuthGuardGuard } from '../authentication/student-auth-guard.guard';
import { AllTestsByATeacherComponent } from './all-tests-by-ateacher/all-tests-by-ateacher.component';
import { StudentdashboardcontentComponent } from './studentdashboardcontent/studentdashboardcontent.component';

const routes: Routes = [
  {
    path:'', 
    component: StudentdashboardcontentComponent,
    children: [
      
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
