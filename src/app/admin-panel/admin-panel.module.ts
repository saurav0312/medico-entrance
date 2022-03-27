import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ReactiveFormsModule } from '@angular/forms';
import { FlexLayoutModule } from '@angular/flex-layout';

import { AdminPanelRoutingModule } from './admin-panel-routing.module';
import { AdminHomePageComponent } from './admin-home-page/admin-home-page.component';
import { AdminLoginPageComponent } from './admin-login-page/admin-login-page.component';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { SpinnerModule } from '../reusableComponents/spinner/spinner.module';
import { AdminDashboardComponent } from './admin-dashboard/admin-dashboard.component';

import { MatSidenavModule } from '@angular/material/sidenav';
import { DividerModule } from 'primeng/divider';
import { ScrollTopModule } from 'primeng/scrolltop';
import { ButtonModule } from 'primeng/button';
import { AdminDashboardHomeContentComponent } from './admin-dashboard-home-content/admin-dashboard-home-content.component';

import { TableModule } from 'primeng/table';
import { PaginatorModule } from 'primeng/paginator';


@NgModule({
  declarations: [
    AdminHomePageComponent,
    AdminLoginPageComponent,
    AdminDashboardComponent,
    AdminDashboardHomeContentComponent
  ],
  imports: [
    CommonModule,
    AdminPanelRoutingModule,
    ReactiveFormsModule,
    FlexLayoutModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatCardModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    SpinnerModule,
    MatSidenavModule,
    DividerModule,
    ScrollTopModule,
    TableModule,
    PaginatorModule,
    ButtonModule
  ]
})
export class AdminPanelModule { }
