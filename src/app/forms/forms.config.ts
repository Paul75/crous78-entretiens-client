import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './forms.routes';
import { AdminGuard } from '@core/authentication/guards/admin.guard';
import { AuthenticationGuard } from '@core/authentication/guards/authentication.guard';
import { RhGuard } from '@core/authentication/guards/rh.guard';

export const formsConfig: ApplicationConfig = {
  providers: [provideRouter(routes), AuthenticationGuard, AdminGuard, RhGuard],
};
