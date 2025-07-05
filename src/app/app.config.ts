import { ApplicationConfig, isDevMode, LOCALE_ID, provideZoneChangeDetection } from '@angular/core';
import { provideRouter, withInMemoryScrolling } from '@angular/router';

import { routes } from './app.routes';
import { HTTP_INTERCEPTORS, provideHttpClient, withFetch } from '@angular/common/http';
import { provideServiceWorker } from '@angular/service-worker';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { providePrimeNG } from 'primeng/config';
import Aura from '@primeng/themes/aura';
import { registerLocaleData } from '@angular/common';
import localeFr from '@angular/common/locales/fr';
import localeFRExtra from '@angular/common/locales/extra/fr';
import { LoaderInterceptor } from '@shared/interceptor/loader.interceptor';

registerLocaleData(localeFr, 'fr-FR', localeFRExtra);
import { fr } from 'primelocale/fr.json';
import { AuthenticationService } from '@core/authentication/authentication.service';
import { DatasCoreService } from '@core/services/datas-core.service';
import { AuthenticationGuard } from '@core/authentication/guards/authentication.guard';
import { AdminGuard } from '@core/authentication/guards/admin.guard';
import { RhGuard } from '@core/authentication/guards/rh.guard';
import { AdminOrRhGuard } from '@core/authentication/guards/admin-or-rh.guard';

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
      translation: fr,
    }),
    { provide: LOCALE_ID, useValue: 'fr-FR' },
    // { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true }
    { provide: HTTP_INTERCEPTORS, useClass: LoaderInterceptor, multi: true },
    AuthenticationGuard,
    AdminGuard,
    RhGuard,
    AdminOrRhGuard,
    DatasCoreService,
    AuthenticationService,
  ],
};
// Détection automatique de l'environnement
export const getCurrentConfig = () => {
  const isProduction =
    window.location.hostname !== 'localhost' &&
    window.location.hostname !== '127.0.0.1' &&
    !window.location.hostname.includes('stackblitz');

  return isProduction ? true : false;
};
