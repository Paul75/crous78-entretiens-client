import { Injectable } from '@angular/core';
import { FormProvider } from './form.provider';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DEFAULT_ENTRETIEN } from '@shared/constants/entretien.constants';
import { FormulaireService } from '@forms/services/formulaire.service';
import { BaseEntretienFormProvider } from './base-entretien-form.provider';

@Injectable()
export class EntretienProProvider extends BaseEntretienFormProvider {
  // private form: FormGroup;

  constructor(fb: FormBuilder, formService: FormulaireService) {
    super(fb, formService);
  }

  override getForm(): FormGroup {
    const data = this.formService.getCurrentValue();

    return this.fb.group({
      ...this.sharedControls(),

      /**
       * FORMULAIRE ENTRETIEN PROFESSIONNEL
       */

      // Etape 3 (step3)
      rappelObjectifs: [DEFAULT_ENTRETIEN.rappelObjectifs],
      evenementsSurvenus: [DEFAULT_ENTRETIEN.evenementsSurvenus],

      // Etape 4 (step4)
      // 3
      // 3.1
      caCompetences: [DEFAULT_ENTRETIEN.caCompetences],
      caContribution: [DEFAULT_ENTRETIEN.caContribution],
      caCapacites: [DEFAULT_ENTRETIEN.caCapacites],
      caAptitude: [DEFAULT_ENTRETIEN.caAptitude],

      // 3.2
      agCompetences: [DEFAULT_ENTRETIEN.agCompetences],
      agContribution: [DEFAULT_ENTRETIEN.agContribution],
      agCapacites: [DEFAULT_ENTRETIEN.agCapacites],
      agAptitude: [DEFAULT_ENTRETIEN.agAptitude],

      realisationObjectifs: [DEFAULT_ENTRETIEN.realisationObjectifs],
      appreciationLitterale: [DEFAULT_ENTRETIEN.appreciationLitterale],

      // Etape 5 (step5)
      acquisExperiencePro: [DEFAULT_ENTRETIEN.acquisExperiencePro],

      // Etape 6 (step6)
      objectifsActivites: [DEFAULT_ENTRETIEN.objectifsActivites],
      demarcheEnvisagee: [DEFAULT_ENTRETIEN.demarcheEnvisagee],

      // Etape 7 (step7)
      evolutionActivites: [DEFAULT_ENTRETIEN.evolutionActivites],
      evolutionCarriere: [DEFAULT_ENTRETIEN.evolutionCarriere],
    });
  }
}
