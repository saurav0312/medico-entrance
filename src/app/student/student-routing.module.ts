import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { StudentprofileComponent } from './studentprofile/studentprofile.component'
import { DetailtestreportComponent } from './detailtestreport/detailtestreport.component';
import { ViewmytestsComponent } from './viewmytests/viewmytests.component';
import { EditprofileinfoComponent } from './editprofileinfo/editprofileinfo.component';

const routes: Routes = [
  {
    path:'', 
    component: StudentprofileComponent,
    children: [
      { path: 'editprofileinfo', component: EditprofileinfoComponent},
      { path: 'detailTestReport', component: DetailtestreportComponent},
      { path: 'viewMyTests', component: ViewmytestsComponent},
      { path: '', redirectTo: '/studentProfile/editprofileinfo', pathMatch: 'full' },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class StudentRoutingModule { }
