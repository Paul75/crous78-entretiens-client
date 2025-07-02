import { Injectable } from '@angular/core';
import { FormProvider } from './form.provider';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FormulaireService } from '@forms/services/formulaire.service';
import { DEFAULT_ENTRETIEN } from '@shared/constants/entretien.constants';

@Injectable()
export abstract class BaseEntretienFormProvider extends FormProvider {
  constructor(
    protected fb: FormBuilder,
    protected formService: FormulaireService,
  ) {
    super();
  }

  protected sharedControls(): { [key: string]: any } {
    return {
      id: [DEFAULT_ENTRETIEN.id, [Validators.required]],
      type: [DEFAULT_ENTRETIEN.type, [Validators.required]],
      statut: [DEFAULT_ENTRETIEN.statut],
      dateEntretien: [DEFAULT_ENTRETIEN.dateEntretien, [Validators.required]],

      personne: this.buildPersonFormGroup(DEFAULT_ENTRETIEN.personne, { requiredId: true }),
      superieur: this.buildPersonFormGroup(DEFAULT_ENTRETIEN.superieur, { light: true }),

      // Etape 2 (step2)
      structure: [DEFAULT_ENTRETIEN.structure],
      intitulePoste: [DEFAULT_ENTRETIEN.intitulePoste],
      dateAffectation: [DEFAULT_ENTRETIEN.dateAffectation],
      emploiType: [DEFAULT_ENTRETIEN.emploiType],
      positionPoste: [DEFAULT_ENTRETIEN.positionPoste],
      quotiteAffectation: [DEFAULT_ENTRETIEN.quotiteAffectation],

      missions: [DEFAULT_ENTRETIEN.missions],

      conduiteProjet: [DEFAULT_ENTRETIEN.conduiteProjet],
      encadrement: [DEFAULT_ENTRETIEN.encadrement],
      cpeNbAgent: [DEFAULT_ENTRETIEN.cpeNbAgent],
      cpeCategA: [DEFAULT_ENTRETIEN.cpeCategA],
      cpeCategB: [DEFAULT_ENTRETIEN.cpeCategB],
      cpeCategC: [DEFAULT_ENTRETIEN.cpeCategC],
    };
  }

  protected buildPersonFormGroup(
    data: any,
    config: { requiredId?: boolean; light?: boolean } = {},
  ): FormGroup {
    const group = this.fb.group({
      id: [data.id, config.requiredId ? [Validators.required] : []],
      matricule: [data.matricule],
      nomUsage: [data.nomUsage],
      nom: [data.nom],
      prenom: [data.prenom],
      dateNaissance: [data.dateNaissance],
      corpsGrade: [data.corpsGrade],
      echelon: [data.echelon],
      datePromotion: [data.datePromotion],
      fonction: [data.fonction],
      structure: [data.structure],
      adresse: [data.adresse],
    });

    if (config.light) {
      ['dateNaissance', 'datePromotion', 'echelon', 'nomUsage'].forEach(field => {
        if ((group as any).contains(field)) {
          (group as any).removeControl(field);
        }
      });
    }

    return group;
  }
}
