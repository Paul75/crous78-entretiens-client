import { Routes } from '@angular/router';

import { FormsComponent } from './forms.component';
import { NotFoundComponent } from '../errors/not-found/not-found.component';
import { AuthenticationGuard } from '@core/authentication/guards/authentication.guard';

export const routes: Routes = [
  {
    path: '',
    component: FormsComponent,
    children: [
      {
        path: 'entretien',
        children: [
          {
            path: 'pro/:id',
            canActivate: [AuthenticationGuard],
            loadComponent: () =>
              import(`./entretien-pro/entretien-pro.component`).then(
                mod => mod.EntretienProComponent,
              ),
          },
          {
            path: 'form/:id',
            canActivate: [AuthenticationGuard],
            loadComponent: () =>
              import(`./entretien-formation/entretien-formation.component`).then(
                mod => mod.EntretienFormationComponent,
              ),
          },
        ],
      },
      {
        path: 'confirmation',
        canActivate: [AuthenticationGuard],
        loadComponent: () =>
          import('./confirmation/confirmation.component').then(mod => mod.ConfirmationComponent),
      },

      { path: '**', component: NotFoundComponent },
    ],
  },
];
