import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddmocktestComponent } from './addmocktest/addmocktest.component';
import { DeletemocktestComponent } from './deletemocktest/deletemocktest.component';
import { MyMockTestsComponent } from './my-mock-tests/my-mock-tests.component';
import { MyTestsBoughtByAStudentComponent } from './my-tests-bought-by-astudent/my-tests-bought-by-astudent.component';
import { MystudentsComponent } from './mystudents/mystudents.component';
import { TeacherProfileComponent } from './teacher-profile/teacher-profile.component';
import { TeacherdashboardcontentComponent } from './teacherdashboardcontent/teacherdashboardcontent.component';
import { TeacherdashboardhomeComponent } from './teacherdashboardhome/teacherdashboardhome.component';
import { TeacherprofileinfoComponent } from './teacherprofileinfo/teacherprofileinfo.component';

const routes: Routes = [
  {
    path:'', 
    component: TeacherdashboardhomeComponent,
    children: [
      { path: 'teacherdashboardcontent', component: TeacherdashboardcontentComponent },
      { path: 'addmocktest', component: AddmocktestComponent },
      { path: 'deletemocktest', component: MyMockTestsComponent },
      { path: 'viewmystudents', component: MystudentsComponent },
      { path: 'myTestsBoughtByAStudent', component: MyTestsBoughtByAStudentComponent },
      { path: '', redirectTo:'/teacherdashboard/teacherdashboardcontent', pathMatch: 'full' }
    ]
  },
  { 
    path: 'teacherProfile', 
    component: TeacherProfileComponent,
    children: [
      { path: 'editprofileinfo', component: TeacherprofileinfoComponent},
      { path: '', redirectTo:'/teacherProfile/editprofileinfo', pathMatch: 'full' }
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TeacherdashboardRoutingModule { }
