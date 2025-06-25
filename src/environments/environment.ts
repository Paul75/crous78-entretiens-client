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
  },
};
