import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
} from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { catchError, Observable, of } from 'rxjs';
import { environment } from '../../../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class PdfService {
  private http = inject(HttpClient);
  private backendUrl = environment.backend;

  downloadPdf(entretienId: number): Observable<any> {
    /*const headers = new HttpHeaders({
      responseType: 'blob',
    });

    return this.http
      .get(this.backendUrl + '/pdfs/' + entretienId, {
        responseType: 'blob'
      })
      .pipe(catchError(this.handleError('newEntretien', {})));
    */
   
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/pdf',
      }),
      responseType: 'blob' as 'json',
    };
    return this.http.get<Blob>(this.backendUrl + '/pdfs/' + entretienId, httpOptions);
  }

  private handleError<T>(operation: string, result: T) {
    return (error: HttpErrorResponse): Observable<T> => {
      console.error(`${operation} failed: ${error.message}`);

      return of(result);
    };
  }
}
