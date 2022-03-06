import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { HttpClientModule } from '@angular/common/http';

import { provideAuth, getAuth } from '@angular/fire/auth';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getStorage, provideStorage } from '@angular/fire/storage'
import { getFirestore, provideFirestore } from '@angular/fire/firestore';

import { environment } from '../environments/environment';
import { StudentModule } from './student/student.module';
import { HomepageModule } from './homepage/homepage.module';
import { AuthenticationModule } from './authentication/authentication.module';
import { StudentdashboardModule } from './studentdashboard/studentdashboard.module';
import { PracticetestModule } from './practicetest/practicetest.module';
import { TeacherdashboardModule } from './teacherdashboard/teacherdashboard.module';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { StudentdashboardhomeComponent } from './studentdashboard/studentdashboardhome/studentdashboardhome.component';


import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
@NgModule({
  declarations: [
    AppComponent,
    PageNotFoundComponent,
    StudentdashboardhomeComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,
    provideAuth(() => getAuth()),
    provideFirebaseApp(() => initializeApp(environment.firebase)),
    provideFirestore(() => getFirestore()),
    provideStorage(() => getStorage()),
    StudentModule,
    HomepageModule,
    AuthenticationModule,
    StudentdashboardModule,
    PracticetestModule,
    TeacherdashboardModule,
    ToastModule
  ],
  providers: [MessageService],
  bootstrap: [AppComponent]
})
export class AppModule { }
