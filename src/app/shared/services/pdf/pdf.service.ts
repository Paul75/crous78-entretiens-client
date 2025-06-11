import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '@environments/environment';
import { catchError, Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PdfService {
  private http = inject(HttpClient);
  private backendUrl = environment.backend;

  downloadPdf(entretienId: string): Observable<any> {
    return this.http
      .get(this.backendUrl + '/pdfs/' + entretienId, {
        responseType: 'blob',
      })
      .pipe(catchError(this.handleError('downloadPdf', {})));
  }

  private handleError<T>(operation: string, result: T) {
    return (error: HttpErrorResponse): Observable<T> => {
      console.error(`${operation} failed: ${error.message}`);

      return of(result);
    };
  }
}
