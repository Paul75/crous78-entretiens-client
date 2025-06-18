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
  selector: 'app-entretien-form-step5',
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
  templateUrl: './step5.component.html',
  styleUrl: './step5.component.scss',
})
export class EntretienFormStep5Component {
  form: FormGroup;

  columns: string[] = []; // Pour stocker les noms des colonnes dynamiques
  columnLabels: { [key: string]: string } = {
    column1: 'Libellé de la formation',
    column2: 'Finalité (action de formation de type 1, 2 ou 3)',
    column3: "Demande à l`initiative de :<br /><ul><li>l'agent</li><li>l'administration</li></ul>",
    column4: 'Durée',
  };

  columnsFormationsDemandees: string[] = []; // Pour stocker les noms des colonnes dynamiques
  columnLabelsFormationsDemandees: { [key: string]: string } = {
    column1: 'Libellé de la formation',
    column2: "Motivation du responsable conduisant l'entretien (si avis défavorable)",
  };

  constructor(
    private formProvider: FormProvider,
    private fb: FormBuilder,
  ) {
    this.form = this.formProvider.getForm();

    this.form.addControl('formationsContinue', this.fb.array([]));
    this.addFormationContinue();

    this.form.addControl('actionsFormationsDemandees', this.fb.array([]));
    this.addActionFormationDemandees();
  }

  get registerFormControl() {
    return this.form.controls;
  }

  addFormationContinue() {
    const formationGroup = this.fb.group({
      column1: [''],
      column2: [''],
      column3: [''],
      column4: [''],
    });
    this.formationsContinue.push(formationGroup);
    this.updateColumns();
  }

  removeFormation(index: number) {
    if (index !== 0) {
      this.formationsContinue.removeAt(index);
    }
  }

  updateColumns() {
    if (this.formationsContinue.length > 0) {
      const sampleGroup = this.formationsContinue.at(0) as FormGroup;
      this.columns = Object.keys(sampleGroup.controls);
    }
  }

  addActionFormationDemandees() {
    const formationGroup = this.fb.group({
      column1: [''],
      column2: [''],
    });
    this.actionsFormationsDemandees.push(formationGroup);
    this.updateColumnsFormationsDemandees();
  }

  updateColumnsFormationsDemandees() {
    if (this.actionsFormationsDemandees.length > 0) {
      const sampleGroup = this.actionsFormationsDemandees.at(0) as FormGroup;
      this.columnsFormationsDemandees = Object.keys(sampleGroup.controls);
    }
  }

  removeFormationsDemandees(index: number) {
    if (index !== 0) {
      this.actionsFormationsDemandees.removeAt(index);
    }
  }

  get formationsContinue(): FormArray {
    return this.form.get('formationsContinue') as FormArray;
  }

  get actionsFormationsDemandees(): FormArray {
    return this.form.get('actionsFormationsDemandees') as FormArray;
  }
}
