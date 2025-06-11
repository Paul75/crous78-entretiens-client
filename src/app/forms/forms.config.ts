import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './forms.routes';

export const formsConfig: ApplicationConfig = {
  providers: [provideRouter(routes)],
};
