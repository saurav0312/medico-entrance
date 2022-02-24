import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ReactiveFormsModule } from '@angular/forms';
import { FlexLayoutModule } from '@angular/flex-layout';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { TabViewModule } from 'primeng/tabview';

import { AuthenticationRoutingModule } from './authentication-routing.module';
import { SigninComponent } from './signin/signin.component';
import { ChoosesignupoptionComponent } from './choosesignupoption/choosesignupoption.component';
import { ForgetpasswordComponent } from './forgetpassword/forgetpassword.component';
import { StudentModule } from '../student/student.module';
import { HomepageModule } from '../homepage/homepage.module';
import { SpinnerModule } from '../reusableComponents/spinner/spinner.module';


@NgModule({
  declarations: [
    SigninComponent,
    ChoosesignupoptionComponent,
    ForgetpasswordComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    AuthenticationRoutingModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatCardModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    FlexLayoutModule,
    StudentModule,
    HomepageModule,
    SpinnerModule,
    TabViewModule
  ]
})
export class AuthenticationModule { }
