import { Routes } from '@angular/router';

import { AdminComponent } from './admin.component';

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
        loadComponent: () =>
          import(`./liste-entretiens/liste-entretiens.component`).then(
            mod => mod.ListeEntretiensComponent,
          ),
      },
      {
        path: 'personnes',
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
