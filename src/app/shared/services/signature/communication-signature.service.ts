import { Injectable } from '@angular/core';
import { shareReplay, Subject } from 'rxjs';

export interface SaveSign {
  entretienId: number;
  signature: string;
}

@Injectable({
  providedIn: 'root',
})
export class CommunicationSignatureService {
  private actionSaveSign = new Subject<SaveSign>();

  actionSaveSign$ = this.actionSaveSign.asObservable().pipe(shareReplay(1));

  saveSignature(action: SaveSign) {
    this.actionSaveSign.next(action);
  }
}
