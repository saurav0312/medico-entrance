import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ContactComponent } from './contact/contact.component';
import { HomeComponent } from './home/home.component';
import { HomepagecontentComponent } from './homepagecontent/homepagecontent.component';

const routes: Routes = [
  {
    path:'', 
    component: HomeComponent,
    children: [
      { path: 'homepagecontent', component: HomepagecontentComponent },
      { path: 'contact', component: ContactComponent },
      { path: '', redirectTo:'/home/homepagecontent', pathMatch: 'full'}
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HomepageRoutingModule { }
