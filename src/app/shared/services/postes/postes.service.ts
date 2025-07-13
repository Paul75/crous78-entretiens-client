import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';
import { environment } from '@environments/environment';
import { Poste } from '@shared/models/poste.model';
import { URL_POSTES } from '@shared/constants/poste.constants';

@Injectable({
  providedIn: 'root',
})
export class PostesService {
  private http = inject(HttpClient);
  private backendUrl = environment.backend;

  getPostes(): Observable<Poste[]> {
    const url = `${this.backendUrl}/${URL_POSTES}`;

    return this.http.get<Poste[]>(url).pipe(catchError(this.handleError<Poste[]>('getPostes')));
  }

  private handleError<T>(operation = 'operation', result: T = {} as T) {
    return (error: HttpErrorResponse): Observable<T> => {
      console.error(`${operation} failed: ${error.message}`);

      return throwError(() => new Error(error.message));
    };
  }
}
