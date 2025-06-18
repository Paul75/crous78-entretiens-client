import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CommunicationSignatureService {
  private actionSaveSign = new Subject<number>();

  actionSaveSign$ = this.actionSaveSign.asObservable();

  saveSignature(action: number) {
    this.actionSaveSign.next(action);
  }
}
