import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MatIconModule } from '@angular/material/icon';

import { PracticetestRoutingModule } from './practicetest-routing.module';
import { PracticetestsComponent } from './practicetests/practicetests.component';
import { StudentdashboardModule } from '../studentdashboard/studentdashboard.module';
import { TestinstructionsComponent } from './testinstructions/testinstructions.component';
import { StarttestComponent } from './starttest/starttest.component';


@NgModule({
  declarations: [
    PracticetestsComponent,
    TestinstructionsComponent,
    StarttestComponent
  ],
  imports: [
    CommonModule,
    MatIconModule,
    PracticetestRoutingModule,
    StudentdashboardModule
  ]
})
export class PracticetestModule { }
