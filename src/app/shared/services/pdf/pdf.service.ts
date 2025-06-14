import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '@environments/environment';
import { catchError, Observable, shareReplay, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PdfService {
  private http = inject(HttpClient);
  private backendUrl = environment.backend;
  private cacheMap = new Map<number, Observable<any>>();

  downloadPdf(entretienId: number): Observable<any> {
    if (!this.cacheMap.has(entretienId)) {
      this.cacheMap.set(
        entretienId,
        this.http
          .get(this.backendUrl + '/pdfs/' + entretienId, {
            responseType: 'blob',
          })
          .pipe(shareReplay({ bufferSize: 1, refCount: true }))
          .pipe(catchError(this.handleError('downloadPdf', {}))),
      );
    }
    return this.cacheMap.get(entretienId)!;

    /*return this.http
      .get(this.backendUrl + '/pdfs/' + entretienId, {
        responseType: 'blob',
      })
      .pipe(shareReplay(1))
      .pipe(catchError(this.handleError('downloadPdf', {})));*/
  }

  resetCache(param: number) {
    this.cacheMap.delete(param);
  }

  private handleError<T>(operation: string, result: T) {
    return (error: HttpErrorResponse): Observable<T> => {
      console.error(`${operation} failed: ${error.message}`);

      return throwError(() => new Error(error.message));
    };
  }
}
