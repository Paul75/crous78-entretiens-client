import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CommunicationSignatureService {
  private actionSaveSign = new Subject<string>();

  actionSaveSign$ = this.actionSaveSign.asObservable();

  saveSignature(action: string) {
    this.actionSaveSign.next(action);
  }
}
