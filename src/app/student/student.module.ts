import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { NgxPrintModule } from 'ngx-print';

import { ReactiveFormsModule } from '@angular/forms';

import { StudentRoutingModule } from './student-routing.module';
import { StudentprofileComponent } from './studentprofile/studentprofile.component';


import { MatSidenavModule } from '@angular/material/sidenav';
import { MatDividerModule } from '@angular/material/divider';
import { MatTableModule } from '@angular/material/table';
import { MatTableExporterModule } from 'mat-table-exporter';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';


import { DetailtestreportComponent } from './detailtestreport/detailtestreport.component';
import { ViewmytestsComponent } from './viewmytests/viewmytests.component';
import { EditprofileinfoComponent } from './editprofileinfo/editprofileinfo.component';
import { SpinnerModule } from '../reusableComponents/spinner/spinner.module';


@NgModule({
  declarations: [
    StudentprofileComponent,
    DetailtestreportComponent,
    ViewmytestsComponent,
    EditprofileinfoComponent
  ],
  imports: [
    CommonModule,
    StudentRoutingModule,
    MatSidenavModule,
    MatDividerModule,
    MatTableModule,
    MatTableExporterModule,
    MatPaginatorModule,
    MatToolbarModule,
    MatIconModule,
    MatCardModule,
    MatButtonModule,
    NgxPrintModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule,
    SpinnerModule

  ],
  exports: [
    StudentprofileComponent,
    DetailtestreportComponent
  ]
})
export class StudentModule { }
