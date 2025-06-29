import { Injectable } from '@angular/core';
import { FormProvider } from './form.provider';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DEFAULT_ENTRETIEN } from '@shared/constants/entretien.constants';
import { FormulaireService } from '@forms/services/formulaire.service';
import { BaseEntretienFormProvider } from './base-entretien-form.provider';

@Injectable()
export class EntretienFormProvider extends BaseEntretienFormProvider {
  constructor(fb: FormBuilder, formService: FormulaireService) {
    super(fb, formService);
  }

  override getForm(): FormGroup {
    const data = this.formService.getCurrentValue();

    return this.fb.group({
      ...this.sharedControls(),

      //
      dateEntretienPrecedent: [DEFAULT_ENTRETIEN.dateEntretienPrecedent],
      soldeCPF: [DEFAULT_ENTRETIEN.soldeCPF],
      utiliserCPF: [DEFAULT_ENTRETIEN.utiliserCPF],

      competenceTransferFormateur: [DEFAULT_ENTRETIEN.competenceTransferFormateur],
      competenceTransferTuteur: [DEFAULT_ENTRETIEN.competenceTransferTuteur],
      competenceTransferPresident: [DEFAULT_ENTRETIEN.competenceTransferPresident],
      competenceTransferMembre: [DEFAULT_ENTRETIEN.competenceTransferMembre],

      formationsDispensees: this.fb.array(
        data.formationsDispensees.map((f: any) => this.fb.group(f)),
      ),

      // Etape 3 (step3)

      formationsRealisees: this.fb.array(
        data.formationsRealisees.map((f: any) => this.fb.group(f)),
      ),

      // Etape 4 (step4)
      formationsDemandees: this.fb.array(
        data.formationsDemandees.map((f: any) => this.fb.group(f)),
      ),

      // Etape 5 (step5)
      formationsContinue: this.fb.array(data.formationsContinue.map((f: any) => this.fb.group(f))),
      actionsFormationsDemandees: this.fb.array(
        data.actionsFormationsDemandees.map((f: any) => this.fb.group(f)),
      ),

      // Etape 6 (step6)
      formationsPreparationConcours: [DEFAULT_ENTRETIEN.formationsPreparationConcours],

      // Etape 7 (step7)
      formationsConstruireProjet: [DEFAULT_ENTRETIEN.formationsConstruireProjet],
    });
  }
}
