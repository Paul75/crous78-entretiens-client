import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CommunicationService {
  private actionGetPdf = new Subject<string>();
  private actionViewPdf = new Subject<string>();


  actionGet$ = this.actionGetPdf.asObservable();
  actionView$ = this.actionViewPdf.asObservable();

  envoyerGetPdf(action: string) {
    this.actionGetPdf.next(action);
  }

  envoyerViewPdf(action: string) {
    this.actionViewPdf.next(action);
  }
}