import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@environments/environment';
import { Observable, map, catchError, of } from 'rxjs';

export interface Roles {
  id: number;
  libelle: string;
}

export interface Credentials {
  // Customize received credentials here
  cn: string;
  displayName: string;
  eppn: string;
  givenName: string;
  mail: string;
  postalCode: string;
  'primary-affiliation': string;
  sn: string;
  supannEmpId: string;
  supannEtablissement: string;
  title: string;
  uid: string;
  'unscoped-affiliation': string;
}
/*export interface LoginContext {
  email: string;
  user: Users;
  password: string;
  remember?: boolean;
}*/

const credentialsKey = 'credentialsEntretiens';

/**
 * Provides a base for authentication workflow.
 * The Credentials interface as well as login/logout methods should be replaced with proper implementation.
 */
@Injectable()
export class AuthenticationService {
  private _credentials!: Credentials | null;

  private backendUrl = environment.backend;

  // tslint:disable-next-line: deprecation
  constructor(private http: HttpClient) {
    const savedCredentials =
      sessionStorage.getItem(credentialsKey) || localStorage.getItem(credentialsKey);
    if (savedCredentials) {
      this._credentials = JSON.parse(savedCredentials);
    }
  }

  /**
   * Authenticates the user.
   * @param {LoginContext} context The login parameters.
   * @return {Observable<Credentials>} The user credentials.
   */
  /**
   * Attributes
cn: Xiaojing BOREL
displayName: Xiaojing BOREL
eppn: xiaojing.borel@crous-versailles.fr
givenName: Xiaojing
mail: xiaojing.borel@crous-versailles.fr
postalCode: 78000
primary-affiliation: staff
sn: BOREL
supannEmpId: 1043637
supannEtablissement: CROUS078
title: Développeur, intégrateur d'applications
uid: xiaojing.borel
unscoped-affiliation: staff
  */
  /*login(context: LoginContext): Observable<Credentials> {
    return this.http.post( '/tokens/token', context)
      .pipe(map((res: Credentials) => {
        const userTmp = {
          id: res.user.id,
          email: context.email,
          firstName: res.user.firstName,
          lastName: res.user.lastName,
          role: res.user.role,
        };
          const data = {
            email: context.email,
            user: userTmp,
            token: res.token,
          };
          this.setCredentials(data, context.remember);
          return data;
      })
    );
  }*/

  /**
   * Authenticates the user.
   * @param {LoginContext} context The login parameters.
   * @return {Observable<Credentials>} The user credentials.
   */
  loginSSO(): Observable<any> {
    return this.http
      .get('https://preprod-gddl-admin.crous-versailles.fr/Shibboleth.sso/Session')
      .pipe(
        map((res: any) => {
          console.log(res);
          const dataSSO: Credentials = {
            cn: 'sqdfdsds',
            displayName: '',
            eppn: '',
            givenName: '',
            mail: 'aaaa@aaa.fr',
            postalCode: '',
            'primary-affiliation': '',
            sn: '',
            supannEmpId: '',
            supannEtablissement: '',
            title: '',
            uid: '',
            'unscoped-affiliation': '',
          };

          return dataSSO;
        }),
        catchError(() => {
          // this.router.navigate(['/unauthorized']);
          return of(false);
        }),
      );

    /*return this.http.post( '/tokens/token', context)
    .pipe(map((res: Credentials) => {
      const userTmp = {
        id: res.user.id,
        email: context.email,
        firstName: res.user.firstName,
        lastName: res.user.lastName,
        role: res.user.role,
      };
        const data = {
          email: context.email,
          user: userTmp,
          token: res.token,
        };
        this.setCredentials(data, context.remember);
        return data;
    })
  );*/

    /*return this.http.post( '/users/login', context)
    .pipe(map((res: Credentials) => {
      const userTmp = {
        id: res.user.id,
        email: context.email,
        firstName: res.user.firstName,
        lastName: res.user.lastName,
        role: res.user.role,
      };

      const data = {
        email: context.email,
        user: userTmp,
        token: res.token,
      };
      this.setCredentials(data, context.remember);
      return data;
    })
  );*/
  }

  /**
   * Logs out the user and clear credentials.
   * @return {Observable<boolean>} True if the user was logged out successfully.
   */
  logout(): Observable<boolean> {
    // Customize credentials invalidation here
    this.setCredentials();
    return of(true);
  }

  checkAccess(page: string): Observable<boolean> {
    return this.http.get<boolean>(this.backendUrl + `/shibboleth/check-access?page=${page}`);
  }

  /**
   * Checks is the user is authenticated.
   * @return {boolean} True if the user is authenticated.
   */
  isAuthenticated(): boolean {
    return !!this.credentials;
  }

  /**
   * Gets the user credentials.
   * @return {Credentials} The user credentials or null if the user is not authenticated.
   */
  get credentials(): Credentials | null {
    return this._credentials;
  }

  /**
   * Sets the user credentials.
   * The credentials may be persisted across sessions by setting the `remember` parameter to true.
   * Otherwise, the credentials are only persisted for the current session.
   * @param {Credentials=} credentials The user credentials.
   * @param {boolean=} remember True to remember credentials across sessions.
   */
  private setCredentials(credentials?: Credentials, remember?: boolean) {
    this._credentials = credentials || null;

    if (credentials) {
      const storage = remember ? localStorage : sessionStorage;
      storage.setItem(credentialsKey, JSON.stringify(credentials));
    } else {
      sessionStorage.removeItem(credentialsKey);
      localStorage.removeItem(credentialsKey);
    }
  }
}
