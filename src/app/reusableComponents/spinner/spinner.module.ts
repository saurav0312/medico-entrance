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

import { AllPracticeTestsComponent } from '../all-practice-tests/all-practice-tests.component';


@NgModule({
  declarations: [
    SpinnerComponent,
    ConfirmationdialogComponent,
    AllPracticeTestsComponent
  ],
  imports: [
    CommonModule,
    MatProgressSpinnerModule,
    MatDialogModule,
    MatButtonModule,
    FormsModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule
  ],
  exports:[
    SpinnerComponent,
    ConfirmationdialogComponent,
    AllPracticeTestsComponent

  ]
})
export class SpinnerModule { }
