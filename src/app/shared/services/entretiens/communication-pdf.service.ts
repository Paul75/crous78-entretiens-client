import { Injectable } from '@angular/core';
import { shareReplay, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CommunicationPdfService {
  private actionGetPdf = new Subject<number>();
  private actionViewPdf = new Subject<number>();

  actionGet$ = this.actionGetPdf.asObservable();
  actionView$ = this.actionViewPdf.asObservable();

  envoyerGetPdf(action: number) {
    this.actionGetPdf.next(action);
  }

  envoyerViewPdf(action: number) {
    this.actionViewPdf.next(action);
  }
}
