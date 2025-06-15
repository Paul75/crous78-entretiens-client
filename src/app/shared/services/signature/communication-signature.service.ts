import { Injectable } from '@angular/core';
import { shareReplay, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CommunicationSignatureService {
  private actionSaveSign = new Subject<number>();

  actionSaveSign$ = this.actionSaveSign.asObservable().pipe(shareReplay(1));

  saveSignature(action: number) {
    this.actionSaveSign.next(action);
  }
}
