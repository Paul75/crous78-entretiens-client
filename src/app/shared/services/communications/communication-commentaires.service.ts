import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CommunicationCommentairesService {
  private actionSaveCommentaire = new Subject<number>();

  actionSaveCommentaire$ = this.actionSaveCommentaire.asObservable();

  saveCommentaires(action: number) {
    this.actionSaveCommentaire.next(action);
  }
}
