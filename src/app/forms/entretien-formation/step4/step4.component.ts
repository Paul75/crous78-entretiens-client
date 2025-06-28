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

@Component({
  selector: 'app-entretien-form-step4',
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
  templateUrl: './step4.component.html',
  styleUrl: './step4.component.scss',
})
export class EntretienFormStep4Component {
  form: FormGroup;

  columns: string[] = []; // Pour stocker les noms des colonnes dynamiques
  columnTypes: { [key: string]: string } = {
    action: 'string',
    nombresHeures: 'number',
  };
  columnLabels: { [key: string]: string } = {
    action: 'Action de formation',
    nombresHeures: "Nombre d'heures",
  };

  constructor(
    private formProvider: FormProvider,
    private fb: FormBuilder,
    private cdref: ChangeDetectorRef,
  ) {
    this.form = this.formProvider.getForm();
  }

  initializeFormWithData(formations?: any[]) {
    if (!this.form.contains('formationsDemandees')) {
      this.form.addControl('formationsDemandees', this.fb.array([]));
    }

    const array = this.formationsDemandees;
    array.clear();

    if (formations?.length) {
      formations.forEach(formation => {
        array.push(
          this.fb.group({
            action: [formation.action],
            nombresHeures: [formation.nombresHeures],
          }),
        );
      });
    } else {
      this.addLine(); // Ajouter une ligne vide
    }

    this.updateColumns();
    this.cdref.detectChanges();
  }

  get registerFormControl() {
    return this.form.controls;
  }

  addLine() {
    const formationGroup = this.fb.group({
      action: [''],
      nombresHeures: [''],
    });
    this.formationsDemandees.push(formationGroup);
    this.updateColumns();
  }

  removeLine(index: number) {
    if (this.formationsDemandees.length > 1) {
      // if (index !== 0) {
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
