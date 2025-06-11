import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';
import { DEFAULT_ENTRETIEN, URL_ENTRETIENS } from '@shared/constants/entretien.constants';
import { Entretien } from '@shared/models/entretien.model';
import { environment } from '@environments/environment';
import { StatutDemandeEnum } from '@shared/enums/statut.deande.enum';

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

  newEntretien(newLine: any): Observable<any> {
    return this.http
      .post(this.backendUrl + '/entretien', newLine)
      .pipe(catchError(this.handleError('newEntretien', DEFAULT_ENTRETIEN)));
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

  private handleError<T>(operation = 'operation', result: T = {} as T) {
    return (error: HttpErrorResponse): Observable<T> => {
      console.error(`${operation} failed: ${error.message}`);

      return throwError(() => new Error(error.message));
    };
  }
}
