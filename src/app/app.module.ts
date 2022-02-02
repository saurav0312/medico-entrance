import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ChooseEntryOptionComponent } from './chooseentryoption/chooseentryoption.component';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatToolbarModule } from '@angular/material/toolbar';
import { ReactiveFormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatTabsModule } from '@angular/material/tabs';
import {MatBadgeModule} from '@angular/material/badge';
import { HomeComponent } from './home/home.component';
import { ForgetpasswordComponent } from './forgetpassword/forgetpassword.component';
import { HttpClientModule } from '@angular/common/http';

import { provideAuth,getAuth } from '@angular/fire/auth';
import { initializeApp,provideFirebaseApp, getApp } from '@angular/fire/app';
import { provideStorage, getStorage } from '@angular/fire/storage'
import { getFirestore, provideFirestore } from '@angular/fire/firestore';

import { environment } from '../environments/environment';
import { ToastrModule } from 'ngx-toastr';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatDividerModule } from '@angular/material/divider';
import { MatTableModule } from '@angular/material/table';
import { MatTableExporterModule } from 'mat-table-exporter';
import { MatPaginatorModule } from '@angular/material/paginator';

import { TableModule } from 'primeng/table';
import { NgxPrintModule } from 'ngx-print';

import { PracticetestsComponent } from './practicetests/practicetests.component';
import { NavigationbarComponent } from './navigationbar/navigationbar.component';
import { ContactComponent } from './contact/contact.component';
import { MainpageComponent } from './mainpage/mainpage.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { DashboardnavigationbarComponent } from './dashboardnavigationbar/dashboardnavigationbar.component';
import { SigninComponent } from './signin/signin.component';
import { StarttestComponent } from './starttest/starttest.component';
import { TestinstructionsComponent } from './testinstructions/testinstructions.component';
import { DetailtestreportComponent } from './detailtestreport/detailtestreport.component';
import { StudentprofileComponent } from './studentprofile/studentprofile.component';

@NgModule({
  declarations: [
    AppComponent,
    ChooseEntryOptionComponent,
    HomeComponent,
    ForgetpasswordComponent,
    PracticetestsComponent,
    NavigationbarComponent,
    ContactComponent,
    MainpageComponent,
    DashboardComponent,
    DashboardnavigationbarComponent,
    SigninComponent,
    StarttestComponent,
    TestinstructionsComponent,
    DetailtestreportComponent,
    StudentprofileComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    FlexLayoutModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatCardModule,
    MatToolbarModule,
    MatSidenavModule,
    ReactiveFormsModule,
    MatIconModule,
    MatTabsModule,
    MatDividerModule,
    MatBadgeModule,
    MatTableModule,
    MatTableExporterModule,
    MatPaginatorModule,
    TableModule,
    NgxPrintModule,
    HttpClientModule,
    provideAuth(() => getAuth()),
    provideFirebaseApp(() => initializeApp(environment.firebase)),
    provideFirestore(() => getFirestore()),
    provideStorage(() => getStorage()),
    ToastrModule.forRoot({
      timeOut: 2000
    })
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
