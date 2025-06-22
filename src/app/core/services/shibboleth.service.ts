import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable, of, throwError } from 'rxjs';
import { map, catchError, tap, delay } from 'rxjs/operators';
import { AuthState, ShibbolethUser, SamlResponse } from '@core/types/auth.types';
import { environment } from '@environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ShibbolethService {
  private config = environment;
  private authStateSubject = new BehaviorSubject<AuthState>({
    isAuthenticated: false,
    user: null,
    token: null,
    loading: false,
    error: null,
  });

  public authState$ = this.authStateSubject.asObservable();

  constructor(private http: HttpClient) {
    this.initializeAuth();
  }

  private initializeAuth(): void {
    const token = localStorage.getItem('shibboleth_token');
    const userData = localStorage.getItem('shibboleth_user');

    if (token && userData) {
      try {
        const user = JSON.parse(userData);
        this.updateAuthState({
          isAuthenticated: true,
          user,
          token,
          loading: false,
          error: null,
        });
      } catch (error) {
        this.clearAuthData();
      }
    }
  }

  login(): void {
    this.updateAuthState({ ...this.authStateSubject.value, loading: true });

    if (this.config.shibboleth.simulateAuth) {
      // Mode développement - simulation
      this.simulateLogin();
    } else {
      // Mode production - vraie redirection Shibboleth
      const returnUrl = encodeURIComponent(window.location.href);
      const loginUrl = `${this.config.shibboleth.loginUrl}?target=${returnUrl}`;
      window.location.href = loginUrl;
    }
  }

  private simulateLogin(): void {
    // Simulation d'une authentification Shibboleth
    console.log("🔧 Mode développement : Simulation de l'authentification Shibboleth");

    // Simule un délai d'authentification
    of(null)
      .pipe(delay(1500))
      .subscribe(() => {
        const mockUser: ShibbolethUser = {
          id: 'dev-user-' + Date.now(),
          email: 'developer@university.edu',
          firstName: 'Développeur',
          lastName: 'Local',
          displayName: 'Développeur Local',
          affiliation: 'student@university.edu',
          entitlements: ['urn:mace:dir:entitlement:common-lib-terms', 'developer-access'],
          attributes: {
            'urn:oid:0.9.2342.19200300.100.1.3': ['developer@university.edu'],
            'urn:oid:2.5.4.42': ['Développeur'],
            'urn:oid:2.5.4.4': ['Local'],
            'urn:oid:2.16.840.1.113730.3.1.241': ['Développeur Local'],
            'urn:oid:1.3.6.1.4.1.5923.1.1.1.1': ['student@university.edu'],
            'urn:oid:1.3.6.1.4.1.5923.1.1.1.7': [
              'urn:mace:dir:entitlement:common-lib-terms',
              'developer-access',
            ],
          },
        };

        const token = this.generateSessionToken();

        this.updateAuthState({
          isAuthenticated: true,
          user: mockUser,
          token,
          loading: false,
          error: null,
        });

        this.saveAuthData(mockUser, token);
        console.log('✅ Authentification simulée réussie:', mockUser);
      });
  }

  handleShibbolethCallback(): Observable<ShibbolethUser> {
    this.updateAuthState({ ...this.authStateSubject.value, loading: true });

    if (this.config.shibboleth.simulateAuth) {
      // Mode développement - retourne l'utilisateur déjà connecté
      const currentUser = this.currentUser;
      if (currentUser) {
        this.updateAuthState({ ...this.authStateSubject.value, loading: false });
        return of(currentUser);
      }
    }

    return this.getShibbolethSession().pipe(
      map(response => this.processSamlResponse(response)),
      tap(user => {
        const token = this.generateSessionToken();
        this.updateAuthState({
          isAuthenticated: true,
          user,
          token,
          loading: false,
          error: null,
        });
        this.saveAuthData(user, token);
      }),
      catchError(error => {
        this.updateAuthState({
          ...this.authStateSubject.value,
          loading: false,
          error: "Erreur lors de l'authentification Shibboleth",
        });
        return throwError(() => error);
      }),
    );
  }

  private getShibbolethSession(): Observable<SamlResponse> {
    const headers = new HttpHeaders({
      Accept: 'application/json',
      'Content-Type': 'application/json',
    });

    if (this.config.shibboleth.simulateAuth) {
      // Mode développement - données simulées
      return of({
        nameId: 'dev-user@university.edu',
        attributes: {
          'urn:oid:0.9.2342.19200300.100.1.3': ['dev-user@university.edu'],
          'urn:oid:2.5.4.42': ['Utilisateur'],
          'urn:oid:2.5.4.4': ['Test'],
          'urn:oid:2.16.840.1.113730.3.1.241': ['Utilisateur Test'],
          'urn:oid:1.3.6.1.4.1.5923.1.1.1.1': ['student@university.edu'],
        },
        sessionId: 'dev-session-' + Date.now(),
      }).pipe(delay(800)); // Simule un délai réseau
    }

    return this.http.get<any>(this.config.shibboleth.sessionUrl, { headers }).pipe(
      map(response => ({
        nameId: response.nameId || '',
        attributes: response.attributes || {},
        sessionId: response.sessionId || '',
      })),
      catchError(() => {
        // Fallback en cas d'erreur
        return of({
          nameId: 'fallback@university.edu',
          attributes: {
            'urn:oid:0.9.2342.19200300.100.1.3': ['fallback@university.edu'],
            'urn:oid:2.5.4.42': ['Utilisateur'],
            'urn:oid:2.5.4.4': ['Fallback'],
            'urn:oid:2.16.840.1.113730.3.1.241': ['Utilisateur Fallback'],
            'urn:oid:1.3.6.1.4.1.5923.1.1.1.1': ['student@university.edu'],
          },
          sessionId: 'fallback-session-' + Date.now(),
        });
      }),
    );
  }

  private processSamlResponse(samlResponse: SamlResponse): ShibbolethUser {
    const attributes = samlResponse.attributes;

    return {
      id: samlResponse.nameId,
      email: this.getAttributeValue(attributes, 'urn:oid:0.9.2342.19200300.100.1.3'),
      firstName: this.getAttributeValue(attributes, 'urn:oid:2.5.4.42'),
      lastName: this.getAttributeValue(attributes, 'urn:oid:2.5.4.4'),
      displayName: this.getAttributeValue(attributes, 'urn:oid:2.16.840.1.113730.3.1.241'),
      affiliation: this.getAttributeValue(attributes, 'urn:oid:1.3.6.1.4.1.5923.1.1.1.1'),
      entitlements: this.getAttributeValues(attributes, 'urn:oid:1.3.6.1.4.1.5923.1.1.1.7'),
      attributes: attributes,
    };
  }

  private getAttributeValue(attributes: Record<string, any>, oid: string): string {
    const value = attributes[oid];
    return Array.isArray(value) ? value[0] || '' : value || '';
  }

  private getAttributeValues(attributes: Record<string, any>, oid: string): string[] {
    const value = attributes[oid];
    return Array.isArray(value) ? value : value ? [value] : [];
  }

  private generateSessionToken(): string {
    return 'shibboleth_' + Math.random().toString(36).substr(2, 9) + Date.now();
  }

  logout(): Observable<void> {
    this.updateAuthState({ ...this.authStateSubject.value, loading: true });

    return of(null).pipe(
      delay(500), // Simule un délai
      tap(() => {
        this.clearAuthData();
        this.updateAuthState({
          isAuthenticated: false,
          user: null,
          token: null,
          loading: false,
          error: null,
        });

        console.log('logout');

        if (!this.config.shibboleth.simulateAuth) {
          // Redirection Shibboleth seulement en production
          const logoutUrl = this.config.shibboleth.logoutUrl;
          window.location.href = logoutUrl;
        } else {
          console.log('🔧 Mode développement : Déconnexion simulée');
        }
      }),
      map(() => void 0),
    );
  }

  private saveAuthData(user: ShibbolethUser, token: string): void {
    localStorage.setItem('shibboleth_user', JSON.stringify(user));
    localStorage.setItem('shibboleth_token', token);
  }

  private clearAuthData(): void {
    localStorage.removeItem('shibboleth_user');
    localStorage.removeItem('shibboleth_token');
  }

  private updateAuthState(state: AuthState): void {
    this.authStateSubject.next(state);
  }

  get currentUser(): ShibbolethUser | null {
    return this.authStateSubject.value.user;
  }

  get isAuthenticated(): boolean {
    return this.authStateSubject.value.isAuthenticated;
  }

  get token(): string | null {
    return this.authStateSubject.value.token;
  }

  get isDevelopmentMode(): boolean {
    return this.config.shibboleth.simulateAuth || false;
  }
}
