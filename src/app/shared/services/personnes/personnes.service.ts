import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';
import { environment } from '@environments/environment';
import { Personne } from '@shared/models/personne.model';
import { URL_PERSONNES } from '@shared/constants/personne.constants';

@Injectable({
  providedIn: 'root',
})
export class PersonnesService {
  private http = inject(HttpClient);
  private backendUrl = environment.backend;

  getPersonnes(): Observable<Personne[]> {
    const url = `${this.backendUrl}/${URL_PERSONNES}`;

    return this.http
      .get<Personne[]>(url)
      .pipe(catchError(this.handleError<Personne[]>('getPersonnes')));
  }
  
  savePersonne(personne: Personne): Observable<Personne> {
    const url = `${this.backendUrl}/${URL_PERSONNES}`;

    return this.http
      .put<Personne>(url + '/' + personne.id, personne)
      .pipe(catchError(this.handleError<Personne>('savePersonne')));
  }
  
  deletePersonne(idPersonne: number): Observable<Personne> {
    const url = `${this.backendUrl}/${URL_PERSONNES}`;

    return this.http
      .delete<Personne>(url + '/' + idPersonne)
      .pipe(catchError(this.handleError<Personne>('deletePersonne')));
  }

  private handleError<T>(operation = 'operation', result: T = {} as T) {
    return (error: HttpErrorResponse): Observable<T> => {
      console.error(`${operation} failed: ${error.message}`);

      return throwError(() => new Error(error.message));
    };
  }
}
