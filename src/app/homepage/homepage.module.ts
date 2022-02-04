import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MatCardModule } from '@angular/material/card';

import { HomepageRoutingModule } from './homepage-routing.module';
import { HomeComponent } from './home/home.component';
import { HomenavigationbarComponent } from './homenavigationbar/homenavigationbar.component';
import { HomepagecontentComponent } from './homepagecontent/homepagecontent.component';
import { ContactComponent } from './contact/contact.component';


@NgModule({
  declarations: [
    HomeComponent,
    HomenavigationbarComponent,
    HomepagecontentComponent,
    ContactComponent
  ],
  imports: [
    CommonModule,
    HomepageRoutingModule,
    MatCardModule
  ],
  exports:[
    HomenavigationbarComponent
  ]
})
export class HomepageModule { }
