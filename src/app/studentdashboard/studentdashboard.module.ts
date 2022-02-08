import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MatBadgeModule } from '@angular/material/badge';
import { MatButtonModule } from '@angular/material/button';
import { MatRadioModule } from '@angular/material/radio';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { SpinnerModule } from '../reusableComponents/spinner/spinner.module';

import { StudentdashboardRoutingModule } from './studentdashboard-routing.module';
import { StudentdashboardnavigationbarComponent } from './studentdashboardnavigationbar/studentdashboardnavigationbar.component';
import { StudentdashboardcontentComponent } from './studentdashboardcontent/studentdashboardcontent.component';
import { AllTestsByATeacherComponent } from './all-tests-by-ateacher/all-tests-by-ateacher.component';


@NgModule({
  declarations: [
    StudentdashboardnavigationbarComponent,
    StudentdashboardcontentComponent,
    AllTestsByATeacherComponent
  ],
  imports: [
    CommonModule,
    StudentdashboardRoutingModule,
    MatBadgeModule,
    SpinnerModule,
    MatButtonModule,
    MatRadioModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule
  ],
  exports:[
    StudentdashboardnavigationbarComponent
  ]
})
export class StudentdashboardModule { }
