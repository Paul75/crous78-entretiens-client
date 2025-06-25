import { appInfo, applicationBase } from './environment.common';

export const environment = {
  appInfo,
  application: {
    ...applicationBase,
    angular: `${applicationBase.angular} DEV`,
  },
  backend: 'http://localhost:3000/api',
  shibboleth: {
    loginUrl: 'http://localhost:4200/', // URL simulée
    logoutUrl: 'http://localhost:3000/api/shibboleth/logout',
    sessionUrl: 'http://localhost:3000/api/shibboleth/session',
    simulateAuth: true, // Active la simulation
  },
};
