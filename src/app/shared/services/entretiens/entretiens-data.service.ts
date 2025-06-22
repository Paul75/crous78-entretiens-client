import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class EntretienDataService {
  private entretienSource = new BehaviorSubject<any>(null);
  currentEntretien = this.entretienSource.asObservable();

  updateEntretien(entretien: any) {
    this.entretienSource.next(entretien);
  }
}
