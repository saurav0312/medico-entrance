import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ChoosesignupoptionComponent } from './choosesignupoption/choosesignupoption.component';
import { ForgetpasswordComponent } from './forgetpassword/forgetpassword.component';
import { SigninComponent } from './signin/signin.component';

const routes: Routes = [
  {
    path:'signin', 
    component: SigninComponent,
    children: [
      { path: '', redirectTo:'/authentication/signin', pathMatch: 'full'}
    ]
  },
  { path: 'chooseSignUpOption', component: ChoosesignupoptionComponent},
  { path: 'forgetpassword', component: ForgetpasswordComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AuthenticationRoutingModule { }
