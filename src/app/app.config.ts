import { ApplicationConfig, isDevMode, LOCALE_ID, provideZoneChangeDetection } from '@angular/core';
import { provideRouter, withInMemoryScrolling } from '@angular/router';

import { routes } from './app.routes';
import { HTTP_INTERCEPTORS, provideHttpClient, withFetch } from '@angular/common/http';
import { provideServiceWorker } from '@angular/service-worker';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { providePrimeNG } from 'primeng/config';
import Aura from '@primeng/themes/aura';
import { CustomDatepickerI18n, I18n } from '@shared/services/datepicker/datepicker.i18n';
import {
  NgbDateAdapter,
  NgbDateParserFormatter,
  NgbDatepickerI18n,
  NgbProgressbarModule,
} from '@ng-bootstrap/ng-bootstrap';
import { CustomDatepickerAdapter } from '@shared/services/datepicker/datepicker.adapter';
import { AuthenticationService } from '@core/authentication/authentication.service';
import { AuthenticationGuard } from '@core/authentication/authentication.guard';
import { CustomDateParserFormatter } from '@shared/services/datepicker/datepicker.formatter';
import { registerLocaleData } from '@angular/common';
import localeFr from '@angular/common/locales/fr';
import localeFRExtra from '@angular/common/locales/extra/fr';
import { LoaderInterceptor } from '@shared/interceptor/loader.interceptor';

registerLocaleData(localeFr, 'fr-FR', localeFRExtra);

export const appConfig: ApplicationConfig = {
  providers: [
    provideHttpClient(withFetch()),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(
      routes,
      withInMemoryScrolling({
        scrollPositionRestoration: 'enabled',
        anchorScrolling: 'enabled',
      }),
    ),
    provideServiceWorker('ngsw-worker.js', {
      enabled: !isDevMode(),
      registrationStrategy: 'registerWhenStable:30000',
    }),
    provideAnimationsAsync(),
    providePrimeNG({
      theme: {
        preset: Aura,
      },
      translation: {
        accept: 'Aceptar',
        reject: 'Rechazar',
        startsWith: 'Commence par',
        contains: 'Contient',
        notContains: 'Ne contient pas',
        endsWith: 'Se termine par',
        equals: 'Égal à',
        notEquals: 'Différent de',
        noFilter: 'Pas de filtre',
      },
    }),
    { provide: LOCALE_ID, useValue: 'fr-FR' },
    I18n,
    { provide: NgbDatepickerI18n, useClass: CustomDatepickerI18n },
    { provide: NgbDateAdapter, useClass: CustomDatepickerAdapter },
    { provide: NgbDateParserFormatter, useClass: CustomDateParserFormatter },
    { provide: NgbProgressbarModule },
    AuthenticationService,
    AuthenticationGuard,
    // { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true }
    { provide: HTTP_INTERCEPTORS, useClass: LoaderInterceptor, multi: true },
  ],
};
