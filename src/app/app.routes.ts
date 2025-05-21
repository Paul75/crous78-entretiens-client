import { Routes } from '@angular/router';

import { HomeComponent } from './modules/general/home/home.component';
import { NotFoundComponent } from './modules/general/not-found/not-found.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },

  {
    path: 'forms',
    loadChildren: () =>
      import(`./modules/general/forms/forms.routes`).then(
        (routes) => routes.routes
      ),
  },
  {
    path: 'admin',
    loadComponent: () =>
      import(`./modules/general/admin/admin.component`).then(
        (mod) => mod.AdminComponent
      ),
  },

  {
    path: 'login',
    loadComponent: () =>
      import(`./modules/general/login/login.component`).then(
        (mod) => mod.LoginComponent
      ),
  },
  {
    path: 'signup',
    loadComponent: () =>
      import(`./modules/general/signup/signup.component`).then(
        (mod) => mod.SignupComponent
      ),
  },
  {
    path: 'contact',
    loadChildren: () =>
      import(`./modules/general/contact/contact.routes`).then(
        (routes) => routes.routes
      ),
  },
  {
    path: 'about',
    loadChildren: () =>
      import('./modules/general/about/about.routes').then(
        (routes) => routes.routes
      ),
  },

  { path: '**', component: NotFoundComponent },
];
