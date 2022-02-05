import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MatBadgeModule } from '@angular/material/badge';

import { StudentdashboardRoutingModule } from './studentdashboard-routing.module';
import { StudentdashboardnavigationbarComponent } from './studentdashboardnavigationbar/studentdashboardnavigationbar.component';
import { StudentdashboardcontentComponent } from './studentdashboardcontent/studentdashboardcontent.component';


@NgModule({
  declarations: [
    StudentdashboardnavigationbarComponent,
    StudentdashboardcontentComponent
  ],
  imports: [
    CommonModule,
    StudentdashboardRoutingModule,
    MatBadgeModule
  ],
  exports:[
    StudentdashboardnavigationbarComponent
  ]
})
export class StudentdashboardModule { }
