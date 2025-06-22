import { FoalTSConfig } from '@core/types/auth.types';
import { appInfo, applicationBase } from './environment.common';

export const environment = {
  appInfo,
  application: {
    ...applicationBase,
    angular: `${applicationBase.angular} PROD`,
  },
  backend: 'https://entretiens.crous-versailles.fr/api',
  shibboleth: {
    loginUrl: '/Shibboleth.sso/Login',
    logoutUrl: '/Shibboleth.sso/Logout',
    sessionUrl: '/Shibboleth.sso/Session',
    simulateAuth: false,
    attributeMap: {
      'urn:oid:0.9.2342.19200300.100.1.1': 'userId',
      'urn:oid:0.9.2342.19200300.100.1.3': 'email',
      'urn:oid:2.5.4.42': 'firstName',
      'urn:oid:2.5.4.4': 'lastName',
      'urn:oid:2.16.840.1.113730.3.1.241': 'displayName',
      'urn:oid:1.3.6.1.4.1.5923.1.1.1.1': 'affiliation',
    },
  },
  foalts: {
    apiUrl: '/api', // URL relative en production
    endpoints: {
      auth: '/auth/shibboleth',
      profile: '/auth/profile',
      refresh: '/auth/refresh',
      logout: '/auth/logout',
    },
  } as FoalTSConfig,
};
