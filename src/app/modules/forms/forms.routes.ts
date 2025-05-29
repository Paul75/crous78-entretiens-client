import { Routes } from '@angular/router';

import { FormsComponent } from './forms.component';

export const routes: Routes = [
  {
    path: '',
    component: FormsComponent,
    children: [
      {
        path: '',
        loadComponent: () =>
          import('./entretien-pro/entretien-pro.component').then(
            (mod) => mod.EntretienProComponent
          ),
      },
      {
        path: 'entretien-pro/:id',
        loadComponent: () =>
          import(`./entretien-pro/entretien-pro.component`).then(
            (mod) => mod.EntretienProComponent
          ),
      },
      {
        path: 'entretien-formation/:id',
        loadComponent: () =>
          import(`./entretien-formation/entretien-formation.component`).then(
            (mod) => mod.EntretienFormationComponent
          ),
      },
      {
        path: 'confirmation',
        loadComponent: () =>
          import('./confirmation/confirmation.component').then(
            (mod) => mod.ConfirmationComponent
          ),
      },

      {
        path: '**',
        loadComponent: () =>
          import('./entretien-pro/entretien-pro.component').then(
            (mod) => mod.EntretienProComponent
          ),
      },
    ],
  },
];
