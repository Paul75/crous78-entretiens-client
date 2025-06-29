import { ChangeDetectorRef, Component } from '@angular/core';
import { CommonModule } from '@angular/common';

import {
  FormsModule,
  ReactiveFormsModule,
  FormGroup,
  FormArray,
  FormBuilder,
} from '@angular/forms';

import { StepperModule } from 'primeng/stepper';
import { ButtonModule } from 'primeng/button';
import { ToggleButtonModule } from 'primeng/togglebutton';
import { FormProvider } from '../../providers/form.provider';
import { TableModule } from 'primeng/table';
import { InputNumberModule } from 'primeng/inputnumber';
import { FormulaireService } from '@forms/services/formulaire.service';
import { DatePickerModule } from 'primeng/datepicker';

@Component({
  selector: 'app-entretien-form-step2',
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    ButtonModule,
    StepperModule,
    InputNumberModule,
    TableModule,
    ToggleButtonModule,
    DatePickerModule,
  ],
  providers: [],
  templateUrl: './step2.component.html',
  styleUrl: './step2.component.scss',
})
export class EntretienFormStep2Component {
  formationsDispenseesDatas: { nom: string; age: number }[] = [];

  form: FormGroup;
  columnsFormationsDispensees: string[] = []; // Pour stocker les noms des colonnes dynamiques
  columnTypes: { [key: string]: string } = {
    annee: 'number',
    disciplineFormation: 'string',
    titreFormation: 'string',
  };

  columnLabels: { [key: string]: string } = {
    annee: 'Année',
    disciplineFormation: 'Discipline de formation',
    titreFormation: 'Titre de la (des) formation(s) animée(s) et organisme(s) concerné(s)',
  };

  constructor(
    private formService: FormulaireService,
    private formProvider: FormProvider,
    private fb: FormBuilder,
    private cdref: ChangeDetectorRef,
  ) {
    this.form = this.formProvider.getForm();
  }

  public initializeFormWithData(formations?: any[]) {
    if (!this.form.contains('formationsDispensees')) {
      this.form.addControl('formationsDispensees', this.fb.array([]));
    }

    const array = this.formationsDispensees;
    array.clear();

    if (formations?.length) {
      formations.forEach(formation => {
        array.push(
          this.fb.group({
            annee: [formation.annee],
            disciplineFormation: [formation.disciplineFormation],
            titreFormation: [formation.titreFormation],
          }),
        );
      });
    } else {
      this.addFormationsDispensees(); // Ajouter une ligne vide
    }

    this.updateColumnsFormationsDispensees();
    this.cdref.detectChanges();
  }

  get registerFormControl() {
    return this.form.controls;
  }

  addFormationsDispensees() {
    const formationGroup = this.fb.group({
      annee: [''],
      disciplineFormation: [''],
      titreFormation: [''],
    });
    this.formationsDispensees.push(formationGroup);
    this.updateColumnsFormationsDispensees();
  }

  removeFormation(index: number) {
    if (this.formationsDispensees.length > 1) {
      this.formationsDispensees.removeAt(index);
    }
  }

  updateColumnsFormationsDispensees() {
    if (this.formationsDispensees.length > 0) {
      const sampleGroup = this.formationsDispensees.at(0) as FormGroup;
      this.columnsFormationsDispensees = Object.keys(sampleGroup.controls);
    }
  }

  get formationsDispensees(): FormArray {
    return this.form.get('formationsDispensees') as FormArray;
  }
}
