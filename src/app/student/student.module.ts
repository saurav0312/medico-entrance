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
import { MatSelectModule } from '@angular/material/select';
import { MatListModule } from '@angular/material/list';
import { MatExpansionModule } from '@angular/material/expansion';
import { FormsModule } from '@angular/forms';
import { MatTabsModule } from '@angular/material/tabs';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDialogModule } from '@angular/material/dialog';

import { TreeModule } from 'primeng/tree';
import { TableModule } from 'primeng/table';
import { PaginatorModule } from 'primeng/paginator';
import { TooltipModule } from 'primeng/tooltip';
import { KnobModule } from "primeng/knob";
import { ProgressBarModule } from 'primeng/progressbar';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { DynamicDialogModule } from 'primeng/dynamicdialog';
import { DropdownModule } from 'primeng/dropdown';
import { DividerModule } from 'primeng/divider';
import { ScrollTopModule } from 'primeng/scrolltop';
import { BadgeModule } from 'primeng/badge';
import { ButtonModule } from 'primeng/button';

import { Ng2GoogleChartsModule } from 'ng2-google-charts'


import { DetailtestreportComponent } from './detailtestreport/detailtestreport.component';
import { EditprofileinfoComponent } from './editprofileinfo/editprofileinfo.component';
import { SpinnerModule } from '../reusableComponents/spinner/spinner.module';
import { MatSortModule } from '@angular/material/sort';
import { IndividualquestionComponent } from './individualquestion/individualquestion.component';
import { StudentPerformanceAnalysisDashboardComponent } from './student-performance-analysis-dashboard/student-performance-analysis-dashboard.component';
import { TabViewModule } from 'primeng/tabview';
import { DetailSubjectTestReportComponent } from './detail-subject-test-report/detail-subject-test-report.component';
import { QuestionAnswerDiscussionComponent } from './question-answer-discussion/question-answer-discussion.component';
import { DiscussionQuestionComponentComponent } from './discussion-question-component/discussion-question-component.component';
import { InputTextModule } from 'primeng/inputtext';
import { StudentPageHomeComponent } from './student-page-home/student-page-home.component';
import { MyDashboardComponent } from './my-dashboard/my-dashboard.component';


@NgModule({
  declarations: [
    StudentprofileComponent,
    DetailtestreportComponent,
    EditprofileinfoComponent,
    IndividualquestionComponent,
    StudentPerformanceAnalysisDashboardComponent,
    DetailSubjectTestReportComponent,
    QuestionAnswerDiscussionComponent,
    DiscussionQuestionComponentComponent,
    StudentPageHomeComponent,
    MyDashboardComponent
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
    MatSelectModule,
    SpinnerModule,
    MatSortModule,
    Ng2GoogleChartsModule,
    MatListModule,
    MatExpansionModule,
    FormsModule,
    MatTabsModule,
    MatTooltipModule,
    MatDialogModule,
    TreeModule,
    TableModule,
    PaginatorModule,
    TooltipModule,
    KnobModule,
    ProgressBarModule,
    TabViewModule,
    InputTextareaModule,
    DynamicDialogModule,
    InputTextModule,
    DropdownModule,
    DividerModule,
    ScrollTopModule,
    BadgeModule,
    ButtonModule
  ],
  exports: [
    StudentprofileComponent,
    DetailtestreportComponent
  ]
})
export class StudentModule { }
