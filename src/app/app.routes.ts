import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { AuthenticationGuard } from '@core/authentication/authentication.guard';
import { NotFoundComponent } from './errors/not-found/not-found.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },

  {
    path: 'forms',
    data: { page: 'form' },
    loadChildren: () => import(`./forms/forms.routes`).then(routes => routes.routes),
  },
  {
    path: 'admin',
    canActivate: [AuthenticationGuard],
    data: { page: 'admin' },
    loadChildren: () => import(`./admin/admin.routes`).then(routes => routes.routes),
  },

  { path: '**', component: NotFoundComponent },
];
