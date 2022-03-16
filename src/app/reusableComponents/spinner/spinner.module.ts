import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { SpinnerComponent } from './spinner.component';
import { MatDialogModule } from '@angular/material/dialog';
import { ConfirmationdialogComponent } from '../confirmationdialog/confirmationdialog.component';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';

import { Ng2GoogleChartsModule } from 'ng2-google-charts'

import { AllPracticeTestsComponent } from '../all-practice-tests/all-practice-tests.component';
import { TestanalysischartComponent } from '../testanalysischart/testanalysischart.component';
import { MatDividerModule } from '@angular/material/divider';

import { ProgressSpinnerModule } from 'primeng/progressspinner';


@NgModule({
  declarations: [
    SpinnerComponent,
    ConfirmationdialogComponent,
    AllPracticeTestsComponent,
    TestanalysischartComponent
  ],
  imports: [
    CommonModule,
    MatProgressSpinnerModule,
    MatDialogModule,
    MatButtonModule,
    FormsModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    Ng2GoogleChartsModule,
    MatDividerModule,
    ProgressSpinnerModule
  ],
  exports:[
    SpinnerComponent,
    ConfirmationdialogComponent,
    AllPracticeTestsComponent,
    TestanalysischartComponent

  ]
})
export class SpinnerModule { }
