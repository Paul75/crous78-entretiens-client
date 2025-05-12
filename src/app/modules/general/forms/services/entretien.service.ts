import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { catchError, Observable, of } from 'rxjs';
import { FormGroup } from '@angular/forms';
import { environment } from '../../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class EntretienService {
    private http = inject(HttpClient);
    private backendUrl = environment.backend;

    newEntretien(newLine: any): Observable<any> {
        console.log(this.backendUrl + '/entretien');
        // return this.http.post(this.backendUrl + '/entretien', newLine);

        return this.http.post(this.backendUrl + '/entretien', newLine).pipe(
            catchError(this.handleError('newEntretien', {}))
        );
    }

    private handleError<T>(operation: string, result: T) {
        return (error: HttpErrorResponse): Observable<T> => {
            console.error(`${operation} failed: ${error.message}`);

            return of(result);
        };
    }
}