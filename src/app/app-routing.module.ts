import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
// import { AngularFireAuthGuard } from '@angular/fire/compat/auth-guard';

import { ChooseEntryOptionComponent } from './chooseentryoption/chooseentryoption.component';
import { HomeComponent } from './home/home.component';
import { ForgetpasswordComponent } from './forgetpassword/forgetpassword.component';
import { ContactComponent } from './contact/contact.component';
import { MainpageComponent } from './mainpage/mainpage.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { PracticetestsComponent } from './practicetests/practicetests.component';
import { SigninComponent } from './signin/signin.component';
import { StarttestComponent } from './starttest/starttest.component';
import { TestinstructionsComponent } from './testinstructions/testinstructions.component';
import { StudentprofileComponent } from './studentprofile/studentprofile.component';
import { DetailtestreportComponent } from './detailtestreport/detailtestreport.component';

const routes: Routes = [
  {path: '', component: MainpageComponent},
  {path: 'home', component: HomeComponent},
  {path: 'chooseSignUpOption', component: ChooseEntryOptionComponent},
  {path: 'signin', component: SigninComponent},
  {path: 'forgetPassword', component:ForgetpasswordComponent},
  {path: 'dashboard', component: DashboardComponent},
  {path: 'contact', component: ContactComponent},
  {path: 'announcement', component: ContactComponent},
  {path: 'news', component: ContactComponent},
  {path: 'freeMockTests', component: PracticetestsComponent},
  {path: 'testInstructions', component:TestinstructionsComponent},
  {path: 'startTest', component:StarttestComponent},
  {path: 'studentProfile', component: StudentprofileComponent},
  {path: 'detailTestReport', component: DetailtestreportComponent}

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
