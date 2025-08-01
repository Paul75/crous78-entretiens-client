import { ChangeDetectorRef, Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';

import {
  FormsModule,
  ReactiveFormsModule,
  FormGroup,
  FormBuilder,
  FormArray,
} from '@angular/forms';

import { ButtonModule } from 'primeng/button';
import { FormProvider } from '../../providers/form.provider';
import { TableModule } from 'primeng/table';
import { InputNumberModule } from 'primeng/inputnumber';
import { AnneeScolaire } from '@shared/utils/annee-scolaire.util';
import { FormulaireService } from '@forms/services/formulaire.service';
import { EntretienStepsService } from '@shared/services/entretiens/entretien-steps.service';
import { firstValueFrom } from 'rxjs';
import { Entretien } from '@shared/models/entretien.model';
import { FormationsRealisees } from '@shared/models/formations-realisees.model';

@Component({
  selector: 'app-entretien-form-step3',
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    ButtonModule,
    InputNumberModule,
    TableModule,
  ],
  providers: [],
  templateUrl: './step3.component.html',
  styleUrl: './step3.component.scss',
})
export class EntretienFormStep3Component {
  form: FormGroup;

  columns: string[] = []; // Pour stocker les noms des colonnes dynamiques
  columnTypes: { [key: string]: string } = {
    libelleFormation: 'string',
    nombresHeures: 'string',
    nombresHeuresCpf: 'string',
    nombresHeuresSuiviEffectif: 'string',
  };
  columnLabels: { [key: string]: string } = {
    libelleFormation: 'Libellé de la formation',
    nombresHeures: 'Nombres d’heures',
    nombresHeuresCpf: 'Nombres d’heures CPF utilisées',
    nombresHeuresSuiviEffectif: 'Nombre d’heures suivi effectif (si absence partielle)',
  };

  formationsRealiseesPeriode = '';

  private entretienStepsService = inject(EntretienStepsService);

  constructor(
    private formService: FormulaireService,
    private formProvider: FormProvider,
    private fb: FormBuilder,
    private cdref: ChangeDetectorRef,
  ) {
    this.form = this.formProvider.getForm();

    this.formationsRealiseesPeriode =
      AnneeScolaire.getAnneeScolaireActuelle().startFormat() +
      ' - ' +
      AnneeScolaire.getAnneeScolaireActuelle().endFormat();
  }

  initialize(entretien: Entretien) {
    if (entretien?.formationsRealisees) {
      this.initializeFormationsRealisees(entretien.formationsRealisees);
    }
  }

  private initializeFormationsRealisees(formationsRealisees?: FormationsRealisees[]) {
    if (!this.form.contains('formationsRealisees')) {
      this.form.addControl('formationsRealisees', this.fb.array([]));
    }

    const array = this.formationsRealisees;
    array.clear();

    const saved = this.formService.getCurrentValue().formationsRealisees;

    const source = saved.length ? saved : formationsRealisees;

    if (source?.length) {
      source.forEach(item => {
        array.push(this.fb.group({ ...item }));
      });
      /*source.forEach((formation?: any) => {
        array.push(
          this.fb.group({
            libelleFormation: [formation.libelleFormation],
            nombresHeures: [formation.nombresHeures],
            nombresHeuresCpf: [formation.nombresHeuresCpf],
            nombresHeuresSuiviEffectif: [formation.nombresHeuresSuiviEffectif],
          }),
        );
      });*/
    } else {
      this.addFormationRealisees();
    }

    this.updateColumns();
    this.cdref.detectChanges();
  }

  get registerFormControl() {
    return this.form.controls;
  }

  addFormationRealisees() {
    this.formationsRealisees.push(
      this.fb.group({
        libelleFormation: [null],
        nombresHeures: [null],
        nombresHeuresCpf: [null],
        nombresHeuresSuiviEffectif: [null],
      }),
    );
  }

  removeFormation(index: number) {
    this.formationsRealisees.removeAt(index);
    if (this.formationsRealisees.length == 0) {
      this.addFormationRealisees();
    }
  }

  updateColumns() {
    if (this.formationsRealisees.length > 0) {
      const sampleGroup = this.formationsRealisees.at(0) as FormGroup;
      this.columns = Object.keys(sampleGroup.controls).filter(k => k !== 'id');
    }
  }

  get formationsRealisees(): FormArray {
    return this.form.get('formationsRealisees') as FormArray;
  }

  async saveDatas(): Promise<void> {
    this.formService.update({
      formationsRealisees: this.form.value.formationsRealisees,
    });

    const { id, formationsRealisees } = this.form.value;

    const step3Payload = {
      formationsRealisees,
    };

    await firstValueFrom(this.entretienStepsService.updateEntretienStep3(id, step3Payload));
  }
}
