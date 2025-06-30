import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '@environments/environment';
import { catchError, Observable, throwError } from 'rxjs';

type EmailType = 'rdv' | 'commentaires' | 'signature';

@Injectable({
  providedIn: 'root',
})
export class CommunicationEmailsService {
  private http = inject(HttpClient);
  private backendUrl = environment.backend;

  /**
   * Envoie un email pour un entretien spécifique.
   * @param entretienId L'identifiant de l'entretien.
   * @param type Le type d'email à envoyer (rdv, commentaires, signature).
   * @returns Un Observable qui émet la réponse du serveur.
   */
  envoyerMail(entretienId: number, type: EmailType): Observable<any> {
    return this.http
      .post(`${this.backendUrl}/emails/entretien/${entretienId}/${type}`, {})
      .pipe(catchError(this.handleError(`envoyerMail${this.capitalize(type)}`)));
  }

  // Petite fonction utilitaire pour capitaliser le type (optionnel)
  private capitalize(str: string): string {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  private handleError<T>(operation = 'operation', result: T = {} as T) {
    return (error: HttpErrorResponse): Observable<T> => {
      console.error(`${operation} failed: ${error.message}`);

      return throwError(() => new Error(error.message));
    };
  }
}
