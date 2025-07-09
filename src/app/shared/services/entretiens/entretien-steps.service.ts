import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { catchError, Observable, tap, throwError } from 'rxjs';
import { Entretien } from '@shared/models/entretien.model';
import { environment } from '@environments/environment';
import { PdfService } from '../pdf/pdf.service';

@Injectable({
  providedIn: 'root',
})
export class EntretienStepsService {
  private http = inject(HttpClient);
  private backendUrl = environment.backend;
  private pdfService = inject(PdfService);

  /*updateEntretien(entretienId: number, datas: Partial<Entretien>): Observable<Entretien> {
    return this.http
      .put<Entretien>(`${this.backendUrl}/entretien/${entretienId}/form`, datas)
      .pipe(catchError(this.handleError<Entretien>('updateEntretien')))
      .pipe(tap(() => this.pdfService.resetCache(entretienId)));
  }*/

  updateEntretienStep1(entretienId: number, datas: Partial<Entretien>): Observable<Entretien> {
    return this.http
      .put<Entretien>(`${this.backendUrl}/entretien/steps/${entretienId}/step1`, datas)
      .pipe(catchError(this.handleError<Entretien>('updateEntretien')))
      .pipe(tap(() => this.pdfService.resetCache(entretienId)));
  }

  updateEntretienStep2(entretienId: number, datas: Partial<Entretien>): Observable<Entretien> {
    return this.http
      .put<Entretien>(`${this.backendUrl}/entretien/steps/${entretienId}/step2`, datas)
      .pipe(catchError(this.handleError<Entretien>('updateEntretien')))
      .pipe(tap(() => this.pdfService.resetCache(entretienId)));
  }

  updateEntretienStep3(entretienId: number, datas: Partial<Entretien>): Observable<Entretien> {
    return this.http
      .put<Entretien>(`${this.backendUrl}/entretien/steps/${entretienId}/step3`, datas)
      .pipe(catchError(this.handleError<Entretien>('updateEntretien')))
      .pipe(tap(() => this.pdfService.resetCache(entretienId)));
  }

  updateEntretienStep4(entretienId: number, datas: Partial<Entretien>): Observable<Entretien> {
    return this.http
      .put<Entretien>(`${this.backendUrl}/entretien/steps/${entretienId}/step4`, datas)
      .pipe(catchError(this.handleError<Entretien>('updateEntretien')))
      .pipe(tap(() => this.pdfService.resetCache(entretienId)));
  }

  updateEntretienStep5(entretienId: number, datas: Partial<Entretien>): Observable<Entretien> {
    return this.http
      .put<Entretien>(`${this.backendUrl}/entretien/steps/${entretienId}/step5`, datas)
      .pipe(catchError(this.handleError<Entretien>('updateEntretien')))
      .pipe(tap(() => this.pdfService.resetCache(entretienId)));
  }

  updateEntretienStep6(entretienId: number, datas: Partial<Entretien>): Observable<Entretien> {
    return this.http
      .put<Entretien>(`${this.backendUrl}/entretien/steps/${entretienId}/step6`, datas)
      .pipe(catchError(this.handleError<Entretien>('updateEntretien')))
      .pipe(tap(() => this.pdfService.resetCache(entretienId)));
  }

  updateEntretienStep7(entretienId: number, datas: Partial<Entretien>): Observable<Entretien> {
    return this.http
      .put<Entretien>(`${this.backendUrl}/entretien/steps/${entretienId}/step7`, datas)
      .pipe(catchError(this.handleError<Entretien>('updateEntretien')))
      .pipe(tap(() => this.pdfService.resetCache(entretienId)));
  }

  updateEntretienStep8(entretienId: number, datas: Partial<Entretien>): Observable<Entretien> {
    return this.http
      .put<Entretien>(`${this.backendUrl}/entretien/steps/${entretienId}/step8`, datas)
      .pipe(catchError(this.handleError<Entretien>('updateEntretien')))
      .pipe(tap(() => this.pdfService.resetCache(entretienId)));
  }

  private handleError<T>(operation = 'operation', result: T = {} as T) {
    return (error: HttpErrorResponse): Observable<T> => {
      console.error(`${operation} failed: ${error.message}`);

      return throwError(() => new Error(error.message));
    };
  }
}
