import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FormsModule } from '@angular/forms';

import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';

import { PracticetestRoutingModule } from './practicetest-routing.module';
import { PracticetestsComponent } from './practicetests/practicetests.component';
import { StudentdashboardModule } from '../studentdashboard/studentdashboard.module';
import { TestinstructionsComponent } from './testinstructions/testinstructions.component';
import { StarttestComponent } from './starttest/starttest.component';
import { SpinnerModule } from '../reusableComponents/spinner/spinner.module';


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
    StudentdashboardModule,
    SpinnerModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    FormsModule
  ]
})
export class PracticetestModule { }
