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
  selector: 'app-entretien-form-step4',
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
  templateUrl: './step4.component.html',
  styleUrl: './step4.component.scss',
})
export class EntretienFormStep4Component {
  form: FormGroup;

  columns: string[] = []; // Pour stocker les noms des colonnes dynamiques
  columnLabels: { [key: string]: string } = {
    column1: 'Action de formation',
    column2: "Nombre d'heures",
  };

  constructor(
    private formProvider: FormProvider,
    private fb: FormBuilder,
  ) {
    this.form = this.formProvider.getForm();

    this.form.addControl('formationsDemandees', this.fb.array([]));
    this.addFormationRealisees();
  }

  get registerFormControl() {
    return this.form.controls;
  }

  addFormationRealisees() {
    const formationGroup = this.fb.group({
      column1: [''],
      column2: [''],
    });
    this.formationsDemandees.push(formationGroup);
    this.updateColumns();
  }

  removeFormation(index: number) {
    if (index !== 0) {
      this.formationsDemandees.removeAt(index);
    }
  }

  updateColumns() {
    if (this.formationsDemandees.length > 0) {
      const sampleGroup = this.formationsDemandees.at(0) as FormGroup;
      this.columns = Object.keys(sampleGroup.controls);
    }
  }

  get formationsDemandees(): FormArray {
    return this.form.get('formationsDemandees') as FormArray;
  }
}
