import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

import {
  FormsModule,
  ReactiveFormsModule,
  FormGroup,
  FormBuilder,
  FormArray,
} from '@angular/forms';

import { NgbDatepickerModule } from '@ng-bootstrap/ng-bootstrap';
import { StepperModule } from 'primeng/stepper';
import { ButtonModule } from 'primeng/button';
import { FormProvider } from '../../providers/form.provider';
import { TableModule } from 'primeng/table';
import { InputNumberModule } from 'primeng/inputnumber';
import { AnneeScolaire } from '@shared/utils/annee-scolaire.util';

@Component({
  selector: 'app-entretien-form-step3',
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgbDatepickerModule,
    ButtonModule,
    StepperModule,
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
    nombresHeures: 'number',
    nombresHeuresCpf: 'number',
    nombresHeuresSuiviEffectif: 'number',
  };
  columnLabels: { [key: string]: string } = {
    libelleFormation: 'Libellé de la formation',
    nombresHeures: 'Nombres d’heures',
    nombresHeuresCpf: 'Nombres d’heures CPF utilisées',
    nombresHeuresSuiviEffectif: 'Nombre d’heures suivi effectif (si absence partielle)',
  };

  formationsRealiseesPeriode = '';

  constructor(
    private formProvider: FormProvider,
    private fb: FormBuilder,
    private cdref: ChangeDetectorRef,
  ) {
    this.form = this.formProvider.getForm();

    this.formationsRealiseesPeriode =
      new AnneeScolaire(new Date().getFullYear()).getAnneeScolaireActuelle().startFormat() +
      ' - ' +
      new AnneeScolaire(new Date().getFullYear()).getAnneeScolaireActuelle().endFormat();
  }

  initializeFormWithData(formations: any[]) {
    if (!this.form.contains('formationsRealisees')) {
      this.form.addControl('formationsRealisees', this.fb.array([]));
    }

    const array = this.formationsRealisees;
    array.clear();

    if (formations?.length) {
      formations.forEach(formation => {
        array.push(
          this.fb.group({
            libelleFormation: [formation.libelleFormation],
            nombresHeures: [formation.nombresHeures],
            nombresHeuresCpf: [formation.nombresHeuresCpf],
            nombresHeuresSuiviEffectif: [formation.nombresHeuresSuiviEffectif],
          }),
        );
      });
    } else {
      this.addFormationRealisees(); // Ajouter une ligne vide
    }

    this.updateColumns();
    this.cdref.detectChanges();
  }

  get registerFormControl() {
    return this.form.controls;
  }

  addFormationRealisees() {
    const formationGroup = this.fb.group({
      libelleFormation: [''],
      nombresHeures: [''],
      nombresHeuresCpf: [''],
      nombresHeuresSuiviEffectif: [''],
    });
    this.formationsRealisees.push(formationGroup);
    this.updateColumns();
  }

  removeFormation(index: number) {
    if (this.formationsRealisees.length > 1) {
      // if (index !== 0) {
      this.formationsRealisees.removeAt(index);
    }
  }

  updateColumns() {
    if (this.formationsRealisees.length > 0) {
      const sampleGroup = this.formationsRealisees.at(0) as FormGroup;
      this.columns = Object.keys(sampleGroup.controls);
    }
  }

  get formationsRealisees(): FormArray {
    return this.form.get('formationsRealisees') as FormArray;
  }
}
