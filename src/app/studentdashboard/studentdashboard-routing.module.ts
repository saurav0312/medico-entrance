import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { StudentdashboardcontentComponent } from './studentdashboardcontent/studentdashboardcontent.component';

const routes: Routes = [
  {
    path:'', 
    component: StudentdashboardcontentComponent,
    children: [
      
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class StudentdashboardRoutingModule { }
