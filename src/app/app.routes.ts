import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { NotFoundComponent } from './errors/not-found/not-found.component';
import { AuthenticationGuard } from '@core/authentication/guards/authentication.guard';
import { AdminOrRhGuard } from '@core/authentication/guards/admin-or-rh.guard';

export const routes: Routes = [
  {
    path: '', // Chemin vide pour la redirection par défaut
    redirectTo: 'home', // Redirige vers 'entretiens'
    pathMatch: 'full',
  },
  {
    path: 'home',
    component: HomeComponent,
    canActivate: [AuthenticationGuard],
  },
  {
    path: 'forms',
    data: { page: 'form' },
    loadChildren: () => import(`./forms/forms.routes`).then(routes => routes.routes),
    canActivate: [AuthenticationGuard],
  },
  {
    path: 'admin',
    canActivate: [AuthenticationGuard, AdminOrRhGuard],
    data: { page: 'admin' },
    loadChildren: () => import(`./admin/admin.routes`).then(routes => routes.routes),
  },

  { path: '**', component: NotFoundComponent },
];
