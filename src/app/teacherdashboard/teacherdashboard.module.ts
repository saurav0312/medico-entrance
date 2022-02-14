import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSortModule } from '@angular/material/sort';
import { MatRippleModule } from '@angular/material/core';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatDividerModule } from '@angular/material/divider';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatSelectModule}  from '@angular/material/select';
import { FormsModule } from '@angular/forms';

import { ReactiveFormsModule } from '@angular/forms';

import { TeacherdashboardRoutingModule } from './teacherdashboard-routing.module';
import { TeacherdashboardcontentComponent } from './teacherdashboardcontent/teacherdashboardcontent.component';
import { TeacherdashboardnavigationbarComponent } from './teacherdashboardnavigationbar/teacherdashboardnavigationbar.component';
import { TeacherdashboardhomeComponent } from './teacherdashboardhome/teacherdashboardhome.component';
import { AddmocktestComponent } from './addmocktest/addmocktest.component';
import { MystudentsComponent } from './mystudents/mystudents.component';
import { SpinnerModule } from '../reusableComponents/spinner/spinner.module';
import { DeletemocktestComponent } from './deletemocktest/deletemocktest.component';
import { TeacherProfileComponent } from './teacher-profile/teacher-profile.component';
import { TeacherprofileinfoComponent } from './teacherprofileinfo/teacherprofileinfo.component';
import { MyTestsBoughtByAStudentComponent } from './my-tests-bought-by-astudent/my-tests-bought-by-astudent.component';
import { MyMockTestsComponent } from './my-mock-tests/my-mock-tests.component';
import { EditmocktestComponent } from './editmocktest/editmocktest.component';


@NgModule({
  declarations: [
    TeacherdashboardcontentComponent,
    TeacherdashboardnavigationbarComponent,
    TeacherdashboardhomeComponent,
    AddmocktestComponent,
    MystudentsComponent,
    DeletemocktestComponent,
    TeacherProfileComponent,
    TeacherprofileinfoComponent,
    MyTestsBoughtByAStudentComponent,
    MyMockTestsComponent,
    EditmocktestComponent
  ],
  imports: [
    CommonModule,
    TeacherdashboardRoutingModule,
    MatFormFieldModule,
    MatButtonModule,
    MatInputModule,
    SpinnerModule,
    ReactiveFormsModule,
    MatRadioModule,
    MatTableModule,
    MatIconModule,
    MatPaginatorModule,
    MatDialogModule,
    MatSortModule,
    MatRippleModule,
    MatTooltipModule,
    MatSidenavModule,
    MatDividerModule,
    MatToolbarModule,
    MatDatepickerModule,
    MatSelectModule,
    FormsModule
  ]
})
export class TeacherdashboardModule { }
