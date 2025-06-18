import { Component } from '@angular/core';
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

@Component({
  selector: 'app-entretien-form-step3',
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgbDatepickerModule,
    ButtonModule,
    StepperModule,
    TableModule,
  ],
  providers: [],
  templateUrl: './step3.component.html',
  styleUrl: './step3.component.scss',
})
export class EntretienFormStep3Component {
  form: FormGroup;

  columns: string[] = []; // Pour stocker les noms des colonnes dynamiques
  columnLabels: { [key: string]: string } = {
    column1: 'Libellé de la formation',
    column2: 'Nombres d’heures',
    column3: 'Nombres d’heures CPF utilisées',
    column4: 'Nombre d’heures suivi effectif (si absence partielle)',
  };

  constructor(
    private formProvider: FormProvider,
    private fb: FormBuilder,
  ) {
    this.form = this.formProvider.getForm();

    this.form.addControl('formationsRealisees', this.fb.array([]));
    this.addFormationRealisees();
  }

  get registerFormControl() {
    return this.form.controls;
  }

  addFormationRealisees() {
    const formationGroup = this.fb.group({
      column1: [''],
      column2: [''],
      column3: [''],
      column4: [''],
    });
    this.formationsRealisees.push(formationGroup);
    this.updateColumns();
  }

  removeFormation(index: number) {
    if (index !== 0) {
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
