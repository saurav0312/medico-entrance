import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TeacherdashboardRoutingModule } from './teacherdashboard-routing.module';
import { TeacherdashboardcontentComponent } from './teacherdashboardcontent/teacherdashboardcontent.component';
import { TeacherdashboardnavigationbarComponent } from './teacherdashboardnavigationbar/teacherdashboardnavigationbar.component';


@NgModule({
  declarations: [
    TeacherdashboardcontentComponent,
    TeacherdashboardnavigationbarComponent
  ],
  imports: [
    CommonModule,
    TeacherdashboardRoutingModule
  ]
})
export class TeacherdashboardModule { }
