import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MatCardModule } from '@angular/material/card';

import { HomepageRoutingModule } from './homepage-routing.module';
import { HomeComponent } from './home/home.component';
import { HomenavigationbarComponent } from './homenavigationbar/homenavigationbar.component';
import { HomepagecontentComponent } from './homepagecontent/homepagecontent.component';
import { ContactComponent } from './contact/contact.component';
import { ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { SpinnerModule } from '../reusableComponents/spinner/spinner.module';
import { NewPageDesignComponent } from './new-page-design/new-page-design.component';


@NgModule({
  declarations: [
    HomeComponent,
    HomenavigationbarComponent,
    HomepagecontentComponent,
    ContactComponent,
    NewPageDesignComponent
  ],
  imports: [
    CommonModule,
    HomepageRoutingModule,
    MatCardModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    SpinnerModule
  ],
  exports:[
    HomenavigationbarComponent
  ]
})
export class HomepageModule { }
