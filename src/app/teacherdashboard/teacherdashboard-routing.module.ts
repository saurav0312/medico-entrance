import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddmocktestComponent } from './addmocktest/addmocktest.component';
import { DeletemocktestComponent } from './deletemocktest/deletemocktest.component';
import { MystudentsComponent } from './mystudents/mystudents.component';
import { TeacherdashboardcontentComponent } from './teacherdashboardcontent/teacherdashboardcontent.component';
import { TeacherdashboardhomeComponent } from './teacherdashboardhome/teacherdashboardhome.component';

const routes: Routes = [
  {
    path:'', 
    component: TeacherdashboardhomeComponent,
    children: [
      { path: 'teacherdashboardcontent', component: TeacherdashboardcontentComponent },
      { path: 'addmocktest', component: AddmocktestComponent },
      { path: 'deletemocktest', component: DeletemocktestComponent },
      { path: 'viewmystudents', component: MystudentsComponent },
      { path: '', redirectTo:'/teacherdashboard/teacherdashboardcontent', pathMatch: 'full' }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TeacherdashboardRoutingModule { }
