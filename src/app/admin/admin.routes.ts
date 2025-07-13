import { Routes } from '@angular/router';

import { AdminComponent } from './admin.component';
import { AuthenticationGuard } from '@core/authentication/guards/authentication.guard';
import { AdminOrRhGuard } from '@core/authentication/guards/admin-or-rh.guard';

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
        canActivate: [AuthenticationGuard, AdminOrRhGuard],
        loadComponent: () =>
          import(`./liste-entretiens/liste-entretiens.component`).then(
            mod => mod.ListeEntretiensComponent,
          ),
      },
      {
        path: 'personnes',
        canActivate: [AuthenticationGuard, AdminOrRhGuard],
        loadComponent: () =>
          import(`./liste-personnes/liste-personnes.component`).then(
            mod => mod.AdminListePersonnesComponent,
          ),
      },
      {
        path: 'fiches-poste',
        canActivate: [AuthenticationGuard, AdminOrRhGuard],
        loadComponent: () =>
          import(`./liste-fiches-poste/liste-fiches-poste.component`).then(
            mod => mod.AdminListeFichesPosteComponent,
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
