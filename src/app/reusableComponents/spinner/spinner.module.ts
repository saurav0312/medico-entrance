import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { SpinnerComponent } from './spinner.component';
import { MatDialogModule } from '@angular/material/dialog';
import { ConfirmationdialogComponent } from '../confirmationdialog/confirmationdialog.component';
import { MatButtonModule } from '@angular/material/button';


@NgModule({
  declarations: [
    SpinnerComponent,
    ConfirmationdialogComponent
  ],
  imports: [
    CommonModule,
    MatProgressSpinnerModule,
    MatDialogModule,
    MatButtonModule
  ],
  exports:[
    SpinnerComponent,
    ConfirmationdialogComponent
  ]
})
export class SpinnerModule { }
