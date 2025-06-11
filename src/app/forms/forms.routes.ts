import { Routes } from '@angular/router';

import { FormsComponent } from './forms.component';
import { NotFoundComponent } from '../errors/not-found/not-found.component';

export const routes: Routes = [
  {
    path: '',
    component: FormsComponent,
    children: [
      /*{
        path: '',
        loadComponent: () =>
          import('./entretien-pro/entretien-pro.component').then(
            (mod) => mod.EntretienProComponent
          ),
      },*/
      {
        path: 'entretien',
        children: [
          {
            path: 'pro/:id',
            loadComponent: () =>
              import(`./entretien-pro/entretien-pro.component`).then(
                mod => mod.EntretienProComponent,
              ),
          },
          {
            path: 'form/:id',
            loadComponent: () =>
              import(`./entretien-formation/entretien-formation.component`).then(
                mod => mod.EntretienFormationComponent,
              ),
          },
        ],
      },
      {
        path: 'confirmation',
        loadComponent: () =>
          import('./confirmation/confirmation.component').then(mod => mod.ConfirmationComponent),
      },

      { path: '**', component: NotFoundComponent },
    ],
  },
];
