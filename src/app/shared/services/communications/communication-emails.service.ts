import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '@environments/environment';
import { catchError, Observable, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CommunicationEmailsService {
  private http = inject(HttpClient);
  private backendUrl = environment.backend;

  envoyerMailChangeDateRdv(entretienId: number): Observable<any> {
    return this.http
      .post(`${this.backendUrl}/emails/entretien/rdv/${entretienId}`, {})
      .pipe(catchError(this.handleError('envoyerMailChangeDateRdv')));
  }

  envoyerMailCommentaires(entretienId: number): Observable<any> {
    return this.http
      .post(`${this.backendUrl}/emails/entretien/commentaires/${entretienId}`, {})
      .pipe(catchError(this.handleError('envoyerMailCommentaires')));
  }

  envoyerMailSignature(entretienId: number): Observable<any> {
    return this.http
      .post(`${this.backendUrl}/emails/entretien/signature/${entretienId}`, {})
      .pipe(catchError(this.handleError('envoyerMailSignature')));
  }

  private handleError<T>(operation = 'operation', result: T = {} as T) {
    return (error: HttpErrorResponse): Observable<T> => {
      console.error(`${operation} failed: ${error.message}`);

      return throwError(() => new Error(error.message));
    };
  }
}
