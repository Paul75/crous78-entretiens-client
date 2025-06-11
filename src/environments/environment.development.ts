import { appInfo, applicationBase } from './environment.common';

export const environment = {
  appInfo,
  application: {
    ...applicationBase,
    angular: `${applicationBase.angular} DEV`,
  },
  backend: 'http://localhost:3000/api',
};
