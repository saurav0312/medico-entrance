import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { StudentAuthGuardGuard } from '../authentication/student-auth-guard.guard';
import { StudentdashboardhomeComponent } from './studentdashboardhome/studentdashboardhome.component';
import { StudentdashboardcontentComponent } from './studentdashboardcontent/studentdashboardcontent.component';

const routes: Routes = [
  {
    path:'', 
    component: StudentdashboardhomeComponent,
    children: [
      {
        path: 'allTeachers',
        component: StudentdashboardcontentComponent
      }
    ],
    canActivate: [ StudentAuthGuardGuard]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class StudentdashboardRoutingModule { }
