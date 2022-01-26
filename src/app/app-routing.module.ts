import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ChooseEntryOptionComponent } from './chooseentryoption/chooseentryoption.component';
import { HomeComponent } from './home/home.component';
import { ForgetpasswordComponent } from './forgetpassword/forgetpassword.component';
import { ContactComponent } from './contact/contact.component';
import { MainpageComponent } from './mainpage/mainpage.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { PracticetestsComponent } from './practicetests/practicetests.component';
import { SigninComponent } from './signin/signin.component';
import { StarttestComponent } from './starttest/starttest.component';

const routes: Routes = [
  {path: '', component: MainpageComponent},
  {path: 'home', component: HomeComponent},
  {path: 'chooseSignUpOption', component: ChooseEntryOptionComponent},
  {path: 'signin', component: SigninComponent},
  {path: 'dashboard', component: DashboardComponent},
  {path: 'contact', component: ContactComponent},
  {path: 'announcement', component: ContactComponent},
  {path: 'news', component: ContactComponent},
  {path: 'freeMockTests', component: PracticetestsComponent},
  {path: 'forgetPassword', component:ForgetpasswordComponent},
  {path: 'startTest', component:StarttestComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
