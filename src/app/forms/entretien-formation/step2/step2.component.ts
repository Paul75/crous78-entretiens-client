import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

import {
  FormsModule,
  ReactiveFormsModule,
  FormGroup,
  FormArray,
  FormBuilder,
} from '@angular/forms';

import { NgbDatepickerModule } from '@ng-bootstrap/ng-bootstrap';
import { StepperModule } from 'primeng/stepper';
import { ButtonModule } from 'primeng/button';
import { ToggleButtonModule } from 'primeng/togglebutton';
import { FormProvider } from '../../providers/form.provider';
import { TableModule } from 'primeng/table';

@Component({
  selector: 'app-entretien-form-step2',
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgbDatepickerModule,
    ButtonModule,
    StepperModule,
    TableModule,
    ToggleButtonModule,
  ],
  providers: [],
  templateUrl: './step2.component.html',
  styleUrl: './step2.component.scss',
})
export class EntretienFormStep2Component implements OnInit {
  form: FormGroup;
  columns: string[] = []; // Pour stocker les noms des colonnes dynamiques
  columnLabels: { [key: string]: string } = {
    column1: 'Année',
    column2: 'Discipline de formation',
    column3: 'Titre de la (des) formation(s) animée(s) et organisme(s) concerné(s)',
  };

  constructor(
    private formProvider: FormProvider,
    private fb: FormBuilder,
  ) {
    this.form = this.formProvider.getForm();

    this.form.addControl('formationsDispensees', this.fb.array([]));
    this.addFormation();
  }

  ngOnInit() {}

  get registerFormControl() {
    return this.form.controls;
  }

  addFormation() {
    const formationGroup = this.fb.group({
      column1: [''],
      column2: [''],
      column3: [''],
    });
    this.formationsDispensees.push(formationGroup);
    this.updateColumns();
  }

  removeFormation(index: number) {
    if (index !== 0) {
      this.formationsDispensees.removeAt(index);
    }
  }

  updateColumns() {
    if (this.formationsDispensees.length > 0) {
      const sampleGroup = this.formationsDispensees.at(0) as FormGroup;
      this.columns = Object.keys(sampleGroup.controls);
    }
  }

  get formationsDispensees(): FormArray {
    return this.form.get('formationsDispensees') as FormArray;
  }
}
