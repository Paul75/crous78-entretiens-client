import { Routes } from '@angular/router';
import { HomeComponent } from './modules/home/home.component';
import { AuthenticationGuard } from './core/authentication/authentication.guard';
import { NotFoundComponent } from './modules/not-found/not-found.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },

  {
    path: 'forms',
    data: { page: 'form' },
    loadChildren: () =>
      import(`./modules/forms/forms.routes`).then(
        (routes) => routes.routes
      ),
  },
  {
    path: 'admin',
    canActivate: [AuthenticationGuard],
    data: { page: 'admin' },
    loadChildren: () =>
      import(`./modules/admin/admin.routes`).then(
        (routes) => routes.routes
      ),
  },
  /*{
    path: 'admin',
    loadComponent: () =>
      import(`./modules/general/admin/admin.component`).then(
        (mod) => mod.AdminComponent
      ),
  },*/

  {
    path: 'login',
    loadComponent: () =>
      import(`./modules/login/login.component`).then(
        (mod) => mod.LoginComponent
      ),
  },
  {
    path: 'signup',
    loadComponent: () =>
      import(`./modules/signup/signup.component`).then(
        (mod) => mod.SignupComponent
      ),
  },
  {
    path: 'contact',
    loadChildren: () =>
      import(`./modules/contact/contact.routes`).then(
        (routes) => routes.routes
      ),
  },
  {
    path: 'about',
    loadChildren: () =>
      import('./modules/about/about.routes').then(
        (routes) => routes.routes
      ),
  },

  { path: '**', component: NotFoundComponent },
];
