export interface ShibbolethUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  displayName: string;
  affiliation: string;
  entitlements: string[];
  attributes: Record<string, any>;
}

export interface AuthState {
  isAuthenticated: boolean;
  user: ShibbolethUser | null;
  token: string | null;
  loading: boolean;
  error: string | null;
}

export interface SamlResponse {
  nameId: string;
  attributes: Record<string, any>;
  sessionId: string;
}

export interface FoalTSConfig {
  apiUrl: string;
  endpoints: {
    auth: string;
    profile: string;
    refresh: string;
    logout: string;
  };
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface EnvironmentConfig {
  shibboleth: {
    loginUrl: string;
    logoutUrl: string;
    sessionUrl: string;
    simulateAuth: boolean;
    attributeMap: Record<string, string>;
  };
  foalts: FoalTSConfig;
}
