import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { catchError, Observable, tap, throwError } from 'rxjs';
import { DEFAULT_ENTRETIEN, URL_ENTRETIENS } from '@shared/constants/entretien.constants';
import { Entretien } from '@shared/models/entretien.model';
import { environment } from '@environments/environment';
import { StatutDemandeEnum } from '@shared/enums/statut.demande.enum';
import { TypesSignatureEnum } from '@shared/enums/types.signature.enum';
import { formatDate } from '@angular/common';
import { PdfService } from '../pdf/pdf.service';

export class EntretienImpl {
  matricule: any | null = null;
  entretienPro: Entretien | null = null;
  entretienForm: Entretien | null = null;
}

@Injectable({
  providedIn: 'root',
})
export class EntretienService {
  private http = inject(HttpClient);
  private backendUrl = environment.backend;
  private pdfService = inject(PdfService);

  getEntretiens(): Observable<Entretien[]> {
    const url = `${this.backendUrl}/${URL_ENTRETIENS}`;

    return this.http
      .get<Entretien[]>(url)
      .pipe(catchError(this.handleError<Entretien[]>('getEntretiens')));
  }

  getEntretien(id: number): Observable<Entretien> {
    const url = `${this.backendUrl}/${URL_ENTRETIENS}/${id}`;

    return this.http
      .get<Entretien>(url)
      .pipe(catchError(this.handleError<Entretien>('getEntretiens')));
  }

  getEntretienByMatricule(matricule: string): Observable<EntretienImpl> {
    const url = `${this.backendUrl}/${URL_ENTRETIENS}/matricule/${matricule}`;

    return this.http
      .get<EntretienImpl>(url)
      .pipe(
        catchError(
          this.handleError(`getEntretienByMatricule matricule=${matricule}`, new EntretienImpl()),
        ),
      );
  }

  newEntretien(newLine: Entretien): Observable<Entretien> {
    return this.http
      .post<Entretien>(this.backendUrl + '/entretien', newLine)
      .pipe(catchError(this.handleError<Entretien>('newEntretien')))
      .pipe(tap((e: Entretien) => this.pdfService.resetCache(e.id)));
  }

  updateEntretien(entretienId: number, datas: Partial<Entretien>): Observable<Entretien> {
    return this.http
      .put<Entretien>(`${this.backendUrl}/entretien/${entretienId}/form`, datas)
      .pipe(catchError(this.handleError<Entretien>('updateEntretien')))
      .pipe(tap(() => this.pdfService.resetCache(entretienId)));
  }

  changeStatut(statut: StatutDemandeEnum, entretienId: number): Observable<any> {
    return this.http
      .put(`${this.backendUrl}/entretien/${entretienId}`, {
        statut,
      })
      .pipe(catchError(this.handleError('changeStatut', DEFAULT_ENTRETIEN)));
  }

  saveDateEntretien(dateEntretien: string, entretienId: number): Observable<any> {
    return this.http
      .put(`${this.backendUrl}/entretien/${entretienId}`, {
        dateEntretien,
        statut: StatutDemandeEnum.RDV,
      })
      .pipe(catchError(this.handleError('saveDateEntretien', DEFAULT_ENTRETIEN)));
  }

  saveSignature(
    entretienId: number,
    signature: string,
    typesSignature: TypesSignatureEnum,
  ): Observable<any> {
    // Définir les configurations possibles pour chaque type de signature
    const signatureConfig = {
      [TypesSignatureEnum.PERSONNE]: {
        dateSignKey: 'dateSignAgent',
        signatureKey: 'signatureAgent',
        statut: StatutDemandeEnum.CHEFSIGN,
      },
      [TypesSignatureEnum.SUPERIEUR]: {
        dateSignKey: 'dateSignChef',
        signatureKey: 'signatureChef',
        statut: StatutDemandeEnum.VALIDE,
      },
    };

    // Obtenir la configuration appropriée en fonction du type de signature
    const config = signatureConfig[typesSignature];

    // Créer l'objet datas en utilisant la configuration
    const datas = {
      entretienId: entretienId,
      [config.dateSignKey]: formatDate(new Date(), 'yyyy-MM-dd', 'fr-FR'),
      [config.signatureKey]: signature,
      statut: config.statut,
    };

    return this.http
      .put(`${this.backendUrl}/entretien/${entretienId}`, datas)
      .pipe(catchError(this.handleError('saveDateEntretien', DEFAULT_ENTRETIEN)))
      .pipe(tap(() => this.pdfService.resetCache(entretienId)));
  }

  private handleError<T>(operation = 'operation', result: T = {} as T) {
    return (error: HttpErrorResponse): Observable<T> => {
      console.error(`${operation} failed: ${error.message}`);

      return throwError(() => new Error(error.message));
    };
  }
}
