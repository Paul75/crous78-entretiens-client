import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export type FormDataType = {
  formationsDispensees: { annee: number; disciplineFormation: string; titreFormation: string }[];
  formationsRealisees: {
    libelleFormation: string;
    nombresHeures: string;
    nombresHeuresCpf: string;
    nombresHeuresSuiviEffectif: string;
  }[];
  formationsDemandees: { action: string; nombresHeures: string }[];
  formationsContinue: {
    libelleFormation: string;
    finalite: string;
    initiativeDemande: string;
    duree: string;
  }[];
  actionsFormationsDemandees: { libelleFormation: string; motivationResponsable: string }[];
};

const defaultData: FormDataType = {
  formationsDispensees: [],
  formationsRealisees: [],
  formationsDemandees: [],
  formationsContinue: [],
  actionsFormationsDemandees: [],
};

@Injectable({ providedIn: 'root' })
export class FormulaireService {
  private data = new BehaviorSubject<FormDataType>(defaultData);

  getFormData() {
    return this.data.asObservable();
  }

  getCurrentValue(): FormDataType {
    return this.data.value;
  }

  update(partial: Partial<FormDataType>) {
    this.data.next({ ...this.data.value, ...partial });
  }

  reset() {
    this.data.next(defaultData);
  }
}
