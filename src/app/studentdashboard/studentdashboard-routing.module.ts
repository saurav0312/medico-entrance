import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AllTestsByATeacherComponent } from './all-tests-by-ateacher/all-tests-by-ateacher.component';
import { StudentdashboardcontentComponent } from './studentdashboardcontent/studentdashboardcontent.component';

const routes: Routes = [
  {
    path:'', 
    component: StudentdashboardcontentComponent,
    children: [
      
    ]
  },
  { path: 'testsByATeacher', component: AllTestsByATeacherComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class StudentdashboardRoutingModule { }
