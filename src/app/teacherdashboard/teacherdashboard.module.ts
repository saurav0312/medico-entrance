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
import { MatTabsModule } from '@angular/material/tabs';

import { DropdownModule }  from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';
import { DividerModule } from 'primeng/divider';
import { TableModule } from 'primeng/table';
import { PaginatorModule } from 'primeng/paginator';
import { TreeModule } from 'primeng/tree';

import { ReactiveFormsModule } from '@angular/forms';

import { TeacherdashboardRoutingModule } from './teacherdashboard-routing.module';
import { TeacherdashboardcontentComponent } from './teacherdashboardcontent/teacherdashboardcontent.component';
import { TeacherdashboardhomeComponent } from './teacherdashboardhome/teacherdashboardhome.component';
import { AddmocktestComponent } from './addmocktest/addmocktest.component';
import { MystudentsComponent } from './mystudents/mystudents.component';
import { SpinnerModule } from '../reusableComponents/spinner/spinner.module';
import { DeletemocktestComponent } from './deletemocktest/deletemocktest.component';
import { TeacherprofileinfoComponent } from './teacherprofileinfo/teacherprofileinfo.component';
import { MyTestsBoughtByAStudentComponent } from './my-tests-bought-by-astudent/my-tests-bought-by-astudent.component';
import { MyMockTestsComponent } from './my-mock-tests/my-mock-tests.component';
import { EditmocktestComponent } from './editmocktest/editmocktest.component';
import { ViewAllStudentsOfAtestComponent } from './view-all-students-of-atest/view-all-students-of-atest.component';
import { ViewTestHistoryOfAStudentOnATestComponent } from './view-test-history-of-astudent-on-atest/view-test-history-of-astudent-on-atest.component';
import { ViewSubjectTestHistoryOfAStudentOnATestComponent } from './view-subject-test-history-of-astudent-on-atest/view-subject-test-history-of-astudent-on-atest.component';


@NgModule({
  declarations: [
    TeacherdashboardcontentComponent,
    TeacherdashboardhomeComponent,
    AddmocktestComponent,
    MystudentsComponent,
    DeletemocktestComponent,
    TeacherprofileinfoComponent,
    MyTestsBoughtByAStudentComponent,
    MyMockTestsComponent,
    EditmocktestComponent,
    ViewAllStudentsOfAtestComponent,
    ViewTestHistoryOfAStudentOnATestComponent,
    ViewSubjectTestHistoryOfAStudentOnATestComponent
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
    FormsModule,
    DropdownModule,
    InputTextModule,
    DividerModule,
    TableModule,
    PaginatorModule,
    TreeModule,
    MatTabsModule
  ]
})
export class TeacherdashboardModule { }
