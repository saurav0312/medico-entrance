import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';

import { ReactiveFormsModule } from '@angular/forms';

import { TeacherdashboardRoutingModule } from './teacherdashboard-routing.module';
import { TeacherdashboardcontentComponent } from './teacherdashboardcontent/teacherdashboardcontent.component';
import { TeacherdashboardnavigationbarComponent } from './teacherdashboardnavigationbar/teacherdashboardnavigationbar.component';
import { TeacherdashboardhomeComponent } from './teacherdashboardhome/teacherdashboardhome.component';
import { AddmocktestComponent } from './addmocktest/addmocktest.component';
import { MystudentsComponent } from './mystudents/mystudents.component';
import { SpinnerModule } from '../reusableComponents/spinner/spinner.module';


@NgModule({
  declarations: [
    TeacherdashboardcontentComponent,
    TeacherdashboardnavigationbarComponent,
    TeacherdashboardhomeComponent,
    AddmocktestComponent,
    MystudentsComponent
  ],
  imports: [
    CommonModule,
    TeacherdashboardRoutingModule,
    MatFormFieldModule,
    MatButtonModule,
    MatInputModule,
    SpinnerModule,
    ReactiveFormsModule,
    MatRadioModule
  ]
})
export class TeacherdashboardModule { }
