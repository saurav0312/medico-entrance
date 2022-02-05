import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TeacherdashboardcontentComponent } from './teacherdashboardcontent/teacherdashboardcontent.component';

const routes: Routes = [
  {
    path:'', 
    component: TeacherdashboardcontentComponent,
    children: [
      
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TeacherdashboardRoutingModule { }
