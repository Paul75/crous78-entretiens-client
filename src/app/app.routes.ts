import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { NotFoundComponent } from './errors/not-found/not-found.component';
import { AuthGuard } from '@core/authentication/guards/auth.guard';

export const routes: Routes = [
  {
    path: '', // Chemin vide pour la redirection par défaut
    redirectTo: 'home', // Redirige vers 'entretiens'
    pathMatch: 'full',
  },
  {
    path: 'login',
    loadComponent: () => import('./login/login.component').then(m => m.LoginComponent),
  },
  {
    path: 'home',
    component: HomeComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'forms',
    data: { page: 'form' },
    loadChildren: () => import(`./forms/forms.routes`).then(routes => routes.routes),
    canActivate: [AuthGuard],
  },
  {
    path: 'admin',
    //canActivate: [AuthenticationGuard],
    data: { page: 'admin' },
    loadChildren: () => import(`./admin/admin.routes`).then(routes => routes.routes),
    canActivate: [AuthGuard],
  },

  { path: '**', component: NotFoundComponent },
];
