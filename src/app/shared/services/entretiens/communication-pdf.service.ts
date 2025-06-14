import { Injectable } from '@angular/core';
import { shareReplay, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CommunicationPdfService {
  private actionGetPdf = new Subject<number>();
  private actionViewPdf = new Subject<number>();

  actionGet$ = this.actionGetPdf.asObservable().pipe(shareReplay(1));
  actionView$ = this.actionViewPdf.asObservable().pipe(shareReplay(1));

  envoyerGetPdf(action: number) {
    this.actionGetPdf.next(action);
  }

  envoyerViewPdf(action: number) {
    this.actionViewPdf.next(action);
  }
}
