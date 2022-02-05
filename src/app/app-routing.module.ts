import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
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
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
