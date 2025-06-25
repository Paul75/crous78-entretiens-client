import { Injectable } from '@angular/core';

import { CredentialsService, Personne } from './credentials.service';
import { HttpErrorResponse } from '@angular/common/http';
import { DatasCoreService } from '@core/services/datas-core.service';
import { catchError, finalize, map, Observable } from 'rxjs';

/**
 * Provides a base for authentication workflow.
 * The login/logout methods should be replaced with proper implementation.
 */
@Injectable({
  providedIn: 'root',
})
export class AuthenticationService {
  constructor(
    private credentialsService: CredentialsService,
    private datasCoreService: DatasCoreService,
  ) {}

  /**
   * Authenticates the user.
   * @param context The login parameters.
   * @return The user credentials.
   */
  setAuth(): Observable<any> {
    return this.datasCoreService.getShibboleth().pipe(
      map((res: Personne) => {
        const userTmp = {
          id: res.id,
          matricule: res.matricule,
          nomUsage: res.nomUsage,
          prenomUsage: res.prenomUsage,
          entite: res.entite,
          niveauHierarchique: res.niveauHierarchique,
          chefDirect: res.chefDirect,
          chefService: res.chefService,
          titre: res.titre,
          fixe: res.fixe,
          login: res.login,
          statut: res.statut,
          dateDebut: res.dateDebut,
          dateFin: res.dateFin,
          sexe: res.sexe,
          photo: res.photo,
          etat: res.etat,
          dateNaissance: res.dateNaissance,
          corpsGrade: res.corpsGrade,
          echelon: res.echelon,
          datePromotion: res.datePromotion || null, // Handle null case
          fonction: res.fonction,
          structure: res.structure,
          adresse: res.adresse,
          ville: res.ville,
          isNew: res.isNew || false, // Default to false if not provided
          isActif: res.isActif || false, // Default to false if not provided
          email: res.email,
          nom: res.nom,
          prenom: res.prenom,
          role: {
            id: res.role.id,
            libelle: res.role.libelle,
          },
        };
        const data = {
          personne: userTmp,
        };
        this.credentialsService.setCredentials(data, true);
        return data;
      }),
      catchError(e => {
        throw new HttpErrorResponse({
          error: e,
          status: e.status,
        });
      }),
      finalize(() => console.info('complete')),
    );
  }

  async verifShibbo(): Promise<any> {
    return await this.datasCoreService.verifStatutShibbo().toPromise();
  }
}
