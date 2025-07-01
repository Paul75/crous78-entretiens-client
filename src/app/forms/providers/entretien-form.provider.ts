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
        //data.formationsDispensees.map((f: any) => this.fb.group(f)),
        data.formationsDispensees.map((f: any) =>
          this.fb.group({
            annee: [f.annee ?? null],
            disciplineFormation: [f.disciplineFormation ?? null],
            titreFormation: [f.titreFormation ?? null],
          }),
        ),
      ),

      // Etape 3 (step3)

      formationsRealisees: this.fb.array(
        // data.formationsRealisees.map((f: any) => this.fb.group(f)),
        data.formationsRealisees.map((f: any) =>
          this.fb.group({
            libelleFormation: [f.libelleFormation ?? null],
            nombresHeures: [f.nombresHeures ?? null],
            nombresHeuresCpf: [f.nombresHeuresCpf ?? null],
            nombresHeuresSuiviEffectif: [f.nombresHeuresSuiviEffectif ?? null],
          }),
        ),
      ),

      // Etape 4 (step4)
      formationsDemandees: this.fb.array(
        // data.formationsDemandees.map((f: any) => this.fb.group(f)),
        data.formationsDemandees.map((f: any) =>
          this.fb.group({
            action: [f.action ?? null],
            nombresHeures: [f.nombresHeures ?? null],
          }),
        ),
      ),

      // Etape 5 (step5)
      formationsContinue: this.fb.array(
        // data.formationsContinue.map((f: any) => this.fb.group(f))
        data.formationsContinue.map((f: any) =>
          this.fb.group({
            libelleFormation: [f.libelleFormation ?? null],
            finalite: [f.finalite ?? null],
            initiativeDemande: [f.initiativeDemande ?? null],
            duree: [f.duree ?? null],
          }),
        ),
      ),
      actionsFormationsDemandees: this.fb.array(
        // data.actionsFormationsDemandees.map((f: any) => this.fb.group(f)),
        data.actionsFormationsDemandees.map((f: any) =>
          this.fb.group({
            action: [f.action ?? null],
            nombresHeures: [f.nombresHeures ?? null],
          }),
        ),
      ),

      // Etape 6 (step6)
      formationsPreparationConcours: [DEFAULT_ENTRETIEN.formationsPreparationConcours],

      // Etape 7 (step7)
      formationsConstruireProjet: [DEFAULT_ENTRETIEN.formationsConstruireProjet],
    });
  }
}
