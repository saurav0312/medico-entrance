import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
// import { AngularFireAuthGuard } from '@angular/fire/compat/auth-guard';

import { DashboardComponent } from './dashboard/dashboard.component';
import { PracticetestsComponent } from './practicetests/practicetests.component';
import { StarttestComponent } from './starttest/starttest.component';
import { TestinstructionsComponent } from './testinstructions/testinstructions.component';

const routes: Routes = [
  {path: '', redirectTo: 'home', pathMatch:'full' },
  {path: 'dashboard', component: DashboardComponent},
  {path: 'freeMockTests', component: PracticetestsComponent},
  {path: 'testInstructions', component:TestinstructionsComponent},
  {path: 'startTest', component:StarttestComponent},
  {
    path: 'home',
    loadChildren: () =>
      import('./homepage/homepage.module').then((m) => m.HomepageModule),
  },
  {
    path: 'authentication',
    loadChildren: () =>
      import('./authentication/authentication.module').then((m) => m.AuthenticationModule),
  },
  {
    path: 'studentProfile',
    loadChildren: () =>
      import('./student/student.module').then((m) => m.StudentModule),
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
