import { ApplicationConfig, provideZoneChangeDetection, isDevMode, LOCALE_ID } from '@angular/core';
import { provideRouter } from '@angular/router';

import { provideHttpClient, withFetch } from '@angular/common/http';
import { withInMemoryScrolling } from '@angular/router';
import { routes } from './app.routes';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';
import { provideServiceWorker } from '@angular/service-worker';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { providePrimeNG } from 'primeng/config';
import Aura from '@primeng/themes/aura';


import localeFRExtra from "@angular/common/locales/extra/fr";
import { registerLocaleData } from '@angular/common';
import localeFr from '@angular/common/locales/fr';
import { NgbDateAdapter, NgbDateParserFormatter, NgbDatepickerI18n } from '@ng-bootstrap/ng-bootstrap';
import { CustomDatepickerI18n, I18n } from './shared/services/datepicker/datepicker.i18n';
import { CustomDatepickerAdapter } from './shared/services/datepicker/datepicker.adapter';
import { CustomDateParserFormatter } from './shared/services/datepicker/datepicker.formatter';
registerLocaleData(localeFr, "fr", localeFRExtra);

export const appConfig: ApplicationConfig = {
  providers: [
    provideHttpClient(
      withFetch(),
    ),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes,
      withInMemoryScrolling({
        scrollPositionRestoration: 'enabled',
        anchorScrolling: 'enabled',
      }),
    ),
    provideClientHydration(withEventReplay()),
    provideServiceWorker('ngsw-worker.js', {
      enabled: !isDevMode(),
      registrationStrategy: 'registerWhenStable:30000'
    }),
    provideAnimationsAsync(),
    providePrimeNG({
      theme: {
        preset: Aura
      }
    }),
    { provide: LOCALE_ID, useValue: "fr-FR"},
    I18n,
    { provide: NgbDatepickerI18n, useClass: CustomDatepickerI18n},
    { provide: NgbDateAdapter, useClass: CustomDatepickerAdapter },
		{ provide: NgbDateParserFormatter, useClass: CustomDateParserFormatter }
  ]
    
};
