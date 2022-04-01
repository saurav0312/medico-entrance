import { Component, NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminAuthGuardGuard } from '../authentication/admin-auth-guard.guard';
import { AdminDashboardHomeContentComponent } from './admin-dashboard-home-content/admin-dashboard-home-content.component';
import { AdminDashboardComponent } from './admin-dashboard/admin-dashboard.component';
import { AdminHomePageComponent } from './admin-home-page/admin-home-page.component';
import { AdminLoginPageComponent } from './admin-login-page/admin-login-page.component';
import { ManageContactRequestsComponent } from './manage-contact-requests/manage-contact-requests.component';

const routes: Routes = [
  {
    path:'', 
    component: AdminHomePageComponent,
    children: [
      {path:'login',component:AdminLoginPageComponent},
      {path:'', redirectTo:'/admin/login', pathMatch:'full'}
    ]
  },
  {
    path:'dashboard',
    component: AdminDashboardComponent,
    children:[
      {path:'home',component:AdminDashboardHomeContentComponent},
      {path:'contactRequests',component:ManageContactRequestsComponent},
      {path:'',redirectTo:'/admin/dashboard/home',pathMatch:'full'}
    ],
    canActivate: [AdminAuthGuardGuard]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminPanelRoutingModule { }
