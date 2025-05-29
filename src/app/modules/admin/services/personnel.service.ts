import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '@environments/environment';
import { catchError, Observable, of } from 'rxjs';
import { PersonneImpl } from '../admin.component';

@Injectable({
  providedIn: 'root',
})
export class PersonnelService {
  private http = inject(HttpClient);
  private backendUrl = environment.backend;

  getPersonnels(employerNumber: number): Observable<PersonneImpl[]> {
    const url = `${this.backendUrl}`;

    return this.http
      .get<PersonneImpl[]>(url + '/admin/search/superieur/personnel/' + employerNumber)
      .pipe(catchError(this.handleError<any>('getPersonnels')));
  }

  private handleError<T>(operation = 'operation', result: T = {} as T) {
    return (error: HttpErrorResponse): Observable<T> => {
      console.error(`${operation} failed: ${error.message}`);

      return of(result);
    };
  }
}
