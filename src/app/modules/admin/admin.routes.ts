import { Routes } from '@angular/router';

import { AdminComponent } from './admin.component';

export const routes: Routes = [
  {
    path: '',
    component: AdminComponent,
    children: [
      /*{
        path: '',
        loadComponent: () =>
          import(`./mailing/mailing.component`).then(
            (mod) => mod.MailingComponent
          ),
      },*/

      {
        path: '**',
        loadComponent: () => import(`./admin.component`)
          .then(mod => mod.AdminComponent)
      },
    ],
  },
];
