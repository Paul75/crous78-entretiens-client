import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError, BehaviorSubject, of } from 'rxjs';
import { map, catchError, tap, delay } from 'rxjs/operators';
import { ApiResponse, ShibbolethUser } from '../types/auth.types';
import { ShibbolethService } from './shibboleth.service';
import { environment } from '@environments/environment';

@Injectable({
  providedIn: 'root',
})
export class FoalTSService {
  private config = environment;
  private readonly apiUrl = this.config.foalts.apiUrl;
  private readonly endpoints = this.config.foalts.endpoints;

  private loadingSubject = new BehaviorSubject<boolean>(false);
  public loading$ = this.loadingSubject.asObservable();

  constructor(
    private http: HttpClient,
    private shibbolethService: ShibbolethService,
  ) {}

  authenticateWithFoalTS(user: ShibbolethUser): Observable<ApiResponse> {
    this.setLoading(true);

    // En mode développement, on simule la réponse FoalTS
    if (this.isDevelopmentMode()) {
      return this.simulateFoalTSAuth(user);
    }

    const headers = this.getHeaders();
    const payload = {
      shibbolethData: {
        nameId: user.id,
        attributes: user.attributes,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        displayName: user.displayName,
        affiliation: user.affiliation,
      },
    };

    return this.http
      .post<ApiResponse>(`${this.apiUrl}${this.endpoints.auth}`, payload, { headers })
      .pipe(
        tap(() => this.setLoading(false)),
        catchError(this.handleError.bind(this)),
      );
  }

  private simulateFoalTSAuth(user: ShibbolethUser): Observable<ApiResponse> {
    console.log("🔧 Mode développement : Simulation de l'authentification FoalTS");

    return of({
      success: true,
      data: {
        token: 'foalts_dev_token_' + Date.now(),
        user: user,
        sessionId: 'foalts_session_' + Date.now(),
      },
      message: 'Authentification FoalTS simulée avec succès',
    }).pipe(
      delay(1000), // Simule un délai réseau
      tap(() => {
        this.setLoading(false);
        console.log('✅ Authentification FoalTS simulée réussie');
      }),
    );
  }

  getUserProfile(): Observable<ApiResponse<ShibbolethUser>> {
    this.setLoading(true);

    if (this.isDevelopmentMode()) {
      return this.simulateGetProfile();
    }

    const headers = this.getAuthHeaders();

    return this.http
      .get<ApiResponse<ShibbolethUser>>(`${this.apiUrl}${this.endpoints.profile}`, { headers })
      .pipe(
        tap(() => this.setLoading(false)),
        catchError(this.handleError.bind(this)),
      );
  }

  private simulateGetProfile(): Observable<ApiResponse<ShibbolethUser>> {
    const currentUser = this.shibbolethService.currentUser;

    if (!currentUser) {
      return throwError(() => new Error('Aucun utilisateur disponible'));
    }

    return of({
      success: true,
      data: currentUser,
      message: 'Profil utilisateur récupéré avec succès',
    }).pipe(
      delay(500),
      tap(() => this.setLoading(false)),
    );
  }

  refreshToken(): Observable<ApiResponse<{ token: string }>> {
    this.setLoading(true);

    if (this.isDevelopmentMode()) {
      return of({
        success: true,
        data: { token: 'refreshed_dev_token_' + Date.now() },
        message: 'Token rafraîchi avec succès',
      }).pipe(
        delay(300),
        tap(() => this.setLoading(false)),
      );
    }

    const headers = this.getAuthHeaders();

    return this.http
      .post<
        ApiResponse<{ token: string }>
      >(`${this.apiUrl}${this.endpoints.refresh}`, {}, { headers })
      .pipe(
        tap(() => this.setLoading(false)),
        catchError(this.handleError.bind(this)),
      );
  }

  logoutFromFoalTS(): Observable<ApiResponse> {
    this.setLoading(true);

    if (this.isDevelopmentMode()) {
      return of({
        success: true,
        message: 'Déconnexion FoalTS simulée avec succès',
      }).pipe(
        delay(300),
        tap(() => this.setLoading(false)),
      );
    }

    const headers = this.getAuthHeaders();

    return this.http
      .post<ApiResponse>(`${this.apiUrl}${this.endpoints.logout}`, {}, { headers })
      .pipe(
        tap(() => this.setLoading(false)),
        catchError(this.handleError.bind(this)),
      );
  }

  // Generic API methods for FoalTS integration
  get<T>(endpoint: string): Observable<ApiResponse<T>> {
    this.setLoading(true);

    if (this.isDevelopmentMode()) {
      return of({
        success: true,
        data: {} as T,
        message: `GET ${endpoint} simulé`,
      }).pipe(
        delay(400),
        tap(() => this.setLoading(false)),
      );
    }

    const headers = this.getAuthHeaders();

    return this.http.get<ApiResponse<T>>(`${this.apiUrl}${endpoint}`, { headers }).pipe(
      tap(() => this.setLoading(false)),
      catchError(this.handleError.bind(this)),
    );
  }

  post<T>(endpoint: string, data: any): Observable<ApiResponse<T>> {
    this.setLoading(true);

    if (this.isDevelopmentMode()) {
      return of({
        success: true,
        data: data as T,
        message: `POST ${endpoint} simulé`,
      }).pipe(
        delay(600),
        tap(() => this.setLoading(false)),
      );
    }

    const headers = this.getAuthHeaders();

    return this.http.post<ApiResponse<T>>(`${this.apiUrl}${endpoint}`, data, { headers }).pipe(
      tap(() => this.setLoading(false)),
      catchError(this.handleError.bind(this)),
    );
  }

  put<T>(endpoint: string, data: any): Observable<ApiResponse<T>> {
    this.setLoading(true);

    if (this.isDevelopmentMode()) {
      return of({
        success: true,
        data: data as T,
        message: `PUT ${endpoint} simulé`,
      }).pipe(
        delay(500),
        tap(() => this.setLoading(false)),
      );
    }

    const headers = this.getAuthHeaders();

    return this.http.put<ApiResponse<T>>(`${this.apiUrl}${endpoint}`, data, { headers }).pipe(
      tap(() => this.setLoading(false)),
      catchError(this.handleError.bind(this)),
    );
  }

  delete<T>(endpoint: string): Observable<ApiResponse<T>> {
    this.setLoading(true);

    if (this.isDevelopmentMode()) {
      return of({
        success: true,
        message: `DELETE ${endpoint} simulé`,
      }).pipe(
        delay(400),
        tap(() => this.setLoading(false)),
      );
    }

    const headers = this.getAuthHeaders();

    return this.http.delete<ApiResponse<T>>(`${this.apiUrl}${endpoint}`, { headers }).pipe(
      tap(() => this.setLoading(false)),
      catchError(this.handleError.bind(this)),
    );
  }

  private getHeaders(): HttpHeaders {
    return new HttpHeaders({
      'Content-Type': 'application/json',
      Accept: 'application/json',
    });
  }

  private getAuthHeaders(): HttpHeaders {
    const token = this.shibbolethService.token;
    const headers = this.getHeaders();

    if (token) {
      return headers.set('Authorization', `Bearer ${token}`);
    }

    return headers;
  }

  private setLoading(loading: boolean): void {
    this.loadingSubject.next(loading);
  }

  private isDevelopmentMode(): boolean {
    return this.shibbolethService.isDevelopmentMode;
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    this.setLoading(false);

    let errorMessage = 'Une erreur est survenue';

    if (error.error instanceof ErrorEvent) {
      // Client-side error
      errorMessage = `Erreur client: ${error.error.message}`;
    } else {
      // Server-side error
      switch (error.status) {
        case 0:
          errorMessage =
            'Impossible de contacter le serveur FoalTS. Vérifiez que le serveur est démarré sur http://localhost:3001';
          break;
        case 401:
          errorMessage = 'Non autorisé - Veuillez vous reconnecter';
          break;
        case 403:
          errorMessage = 'Accès interdit';
          break;
        case 404:
          errorMessage = 'Ressource non trouvée';
          break;
        case 500:
          errorMessage = 'Erreur serveur interne';
          break;
        default:
          errorMessage = `Erreur ${error.status}: ${error.error?.message || error.message}`;
      }
    }

    console.error('FoalTS API Error:', error);
    return throwError(() => new Error(errorMessage));
  }
}
