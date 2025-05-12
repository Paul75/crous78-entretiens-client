import { Routes } from '@angular/router';

import { FormsComponent } from './forms.component';

export const routes: Routes = [
  {
    path: '', component: FormsComponent, children: [
      { path: '', loadComponent: () => import('./entretien-pro/entretien-pro.component').then(mod => mod.EntretienProComponent) },

      { path: 'entretien-pro', loadComponent: () => import('./entretien-pro/entretien-pro.component').then(mod => mod.EntretienProComponent) },
      { path: 'entretien-formation', loadComponent: () => import('./entretien-formation/entretien-formation.component').then(mod => mod.EntretienFormationComponent) },

      { path: '**', loadComponent: () => import('./entretien-pro/entretien-pro.component').then(mod => mod.EntretienProComponent) },
    ]
  },
];