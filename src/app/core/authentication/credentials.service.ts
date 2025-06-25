import { Injectable } from '@angular/core';

export interface Roles {
  id: number;
  libelle: string;
}

export interface Personne {
  id: number;
  matricule: number;
  nomUsage: string;
  prenomUsage: string;
  nom: string;
  prenom: string;
  entite: string;
  niveauHierarchique: string;
  chefDirect: string;
  chefService: string;
  titre: string;
  email: string;
  fixe: string;
  login: string;
  statut: string;
  dateDebut: string;
  dateFin: string;
  sexe: string;
  photo: string;
  etat: string;
  dateNaissance: string;
  corpsGrade: string;
  echelon: string;
  datePromotion: string | null;
  fonction: string;
  structure: string;
  adresse: string;
  ville: string;
  isNew?: boolean;
  isActif?: boolean;
  role: Roles;
}

export interface Credentials {
  personne: Personne;
}

const credentialsKey = 'credentialsEntretiens';

/**
 * Provides storage for authentication credentials.
 * The Credentials interface should be replaced with proper implementation.
 */
@Injectable({
  providedIn: 'root',
})
export class CredentialsService {
  private _credentials: Credentials | null = null;

  constructor() {
    const savedCredentials =
      sessionStorage.getItem(credentialsKey) || localStorage.getItem(credentialsKey);
    if (savedCredentials) {
      this._credentials = JSON.parse(savedCredentials);
    }
  }

  /**
   * Checks is the user is authenticated.
   * @return True if the user is authenticated.
   */
  isAuthenticated(): boolean {
    return !!this.credentials;
  }

  isAuthenticatedShibbo(): boolean {
    return !!this.credentials;
  }

  /**
   * Gets the user credentials.
   * @return The user credentials or null if the user is not authenticated.
   */
  get credentials(): Credentials | null {
    return this._credentials;
  }

  get isUser(): boolean {
    return this.credentials ? this.credentials.personne.role.libelle === 'USER' : false;
  }
  get isAdmin(): boolean {
    return this.credentials ? this.credentials.personne.role.libelle === 'ADMIN' : false;
  }

  get isRH(): boolean {
    return this.credentials ? this.credentials.personne.role.libelle === 'RH' : false;
  }

  /**
   * Sets the user credentials.
   * The credentials may be persisted across sessions by setting the `remember` parameter to true.
   * Otherwise, the credentials are only persisted for the current session.
   * @param credentials The user credentials.
   * @param remember True to remember credentials across sessions.
   */
  setCredentials(credentials?: Credentials, remember?: boolean) {
    // console.log('***** setCredentials *****');
    // console.log(credentials);

    this._credentials = credentials || null;

    if (credentials) {
      const storage = remember ? localStorage : sessionStorage;
      storage.setItem(credentialsKey, JSON.stringify(credentials));
    } else {
      sessionStorage.removeItem(credentialsKey);
      localStorage.removeItem(credentialsKey);
    }
  }

  logout() {
    this._credentials = null;
    sessionStorage.removeItem(credentialsKey);
    localStorage.removeItem(credentialsKey);
  }
}
