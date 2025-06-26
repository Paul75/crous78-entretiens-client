import { Routes } from '@angular/router';

import { AdminComponent } from './admin.component';
import { AuthenticationGuard } from '@core/authentication/guards/authentication.guard';
import { AdminGuard } from '@core/authentication/guards/admin.guard';
import { RhGuard } from '@core/authentication/guards/rh.guard';

export const routes: Routes = [
  {
    path: '',
    component: AdminComponent,
    children: [
      {
        path: '', // Chemin vide pour la redirection par défaut
        redirectTo: 'entretiens', // Redirige vers 'entretiens'
        pathMatch: 'full',
      },
      {
        path: 'entretiens',
        canActivate: [AuthenticationGuard, AdminGuard, RhGuard],
        loadComponent: () =>
          import(`./liste-entretiens/liste-entretiens.component`).then(
            mod => mod.ListeEntretiensComponent,
          ),
      },
      {
        path: 'personnes',
        canActivate: [AuthenticationGuard, AdminGuard, RhGuard],
        loadComponent: () =>
          import(`./liste-personnes/liste-personnes.component`).then(
            mod => mod.AdminListePersonnesComponent,
          ),
      },
    ],
  },

  {
    path: '**',
    redirectTo: '', // Redirige vers la route par défaut ou une page 404 personnalisée
    pathMatch: 'full',
  },
];
