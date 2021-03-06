import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
// import { AngularFireAuthGuard } from '@angular/fire/compat/auth-guard';

const routes: Routes = [
  {path: '', redirectTo: 'home', pathMatch:'full' },
  {
    path: 'home',
    loadChildren: () =>
      import('./homepage/homepage.module').then((m) => m.HomepageModule),
  },
  {
    path: 'authentication',
    loadChildren: () =>
      import('./authentication/authentication.module').then((m) => m.AuthenticationModule),
  },
  {
    path: 'studentdashboard',
    loadChildren: () =>
      import('./studentdashboard/studentdashboard.module').then((m) => m.StudentdashboardModule),
  },
  {
    path: 'studentProfile',
    loadChildren: () =>
      import('./student/student.module').then((m) => m.StudentModule),
  },
  {
    path: 'practicetest',
    loadChildren: () =>
      import('./practicetest/practicetest.module').then((m) => m.PracticetestModule),
  },
  {
    path: 'teacherdashboard',
    loadChildren: () =>
      import('./teacherdashboard/teacherdashboard.module').then((m) => m.TeacherdashboardModule),
  },
  {
    path: 'admin',
    loadChildren: () =>
      import('./admin-panel/admin-panel.module').then((m) => m.AdminPanelModule),
  },
  { path: '**', component: PageNotFoundComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
