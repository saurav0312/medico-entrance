import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { StudentAuthGuardGuard } from '../authentication/student-auth-guard.guard';
import { PracticetestsComponent } from './practicetests/practicetests.component';
import { StarttestComponent } from './starttest/starttest.component';
import { TestinstructionsComponent } from './testinstructions/testinstructions.component';

const routes: Routes = [
  {
    path:'', 
    component: PracticetestsComponent,
    children: [
    ],
    canActivate: [StudentAuthGuardGuard]
  },
  { 
    path: 'testInstructions', 
    component: TestinstructionsComponent,
    canActivate: [StudentAuthGuardGuard]
  },
  { 
    path: 'startTest', 
    component:StarttestComponent,
    canActivate: [StudentAuthGuardGuard] 
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PracticetestRoutingModule { }
