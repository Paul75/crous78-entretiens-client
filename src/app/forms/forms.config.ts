import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './forms.routes';
import { AuthenticationGuard } from '@core/authentication/guards/authentication.guard';
import { AdminOrRhGuard } from '@core/authentication/guards/admin-or-rh.guard';

export const formsConfig: ApplicationConfig = {
  providers: [provideRouter(routes), AuthenticationGuard, AdminOrRhGuard],
};
