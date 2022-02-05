import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PracticetestsComponent } from './practicetests/practicetests.component';
import { StarttestComponent } from './starttest/starttest.component';
import { TestinstructionsComponent } from './testinstructions/testinstructions.component';

const routes: Routes = [
  {
    path:'', 
    component: PracticetestsComponent,
    children: [
    ]
  },
  { path: 'testInstructions', component: TestinstructionsComponent},
  { path: 'startTest', component:StarttestComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PracticetestRoutingModule { }
