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
import { FormulaireService } from '@forms/services/formulaire.service';
import { EntretienStepsService } from '@shared/services/entretiens/entretien-steps.service';
import { firstValueFrom } from 'rxjs';
import { Entretien } from '@shared/models/entretien.model';
import { FormationsDemandees } from '@shared/models/formations-demandees.model';

@Component({
  selector: 'app-entretien-form-step4',
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    ButtonModule,
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
    nombresHeures: 'string',
  };
  columnLabels: { [key: string]: string } = {
    action: 'Action de formation',
    nombresHeures: "Nombre d'heures",
  };

  private entretienStepsService = inject(EntretienStepsService);

  constructor(
    private formService: FormulaireService,
    private formProvider: FormProvider,
    private fb: FormBuilder,
    private cdref: ChangeDetectorRef,
  ) {
    this.form = this.formProvider.getForm();
  }

  initialize(entretien: Entretien) {
    if (entretien?.formationsRealisees) {
      this.initializeFormationsDemandees(entretien.formationsDemandees);
    }
  }

  private initializeFormationsDemandees(formationsDemandees?: FormationsDemandees[]) {
    if (!this.form.contains('formationsDemandees')) {
      this.form.addControl('formationsDemandees', this.fb.array([]));
    }

    const array = this.formationsDemandees;
    array.clear();

    const saved = this.formService.getCurrentValue().formationsDemandees;

    const source = saved.length ? saved : formationsDemandees;

    if (source?.length) {
      source.forEach(item => {
        array.push(this.fb.group({ ...item }));
      });
    } else {
      this.addLine();
    }

    this.updateColumns();
    this.cdref.detectChanges();
  }

  get registerFormControl() {
    return this.form.controls;
  }

  addLine() {
    this.formationsDemandees.push(
      this.fb.group({
        action: [null],
        nombresHeures: [null],
      }),
    );
  }

  removeLine(index: number) {
    this.formationsDemandees.removeAt(index);
    if (this.formationsDemandees.length == 0) {
      this.addLine();
    }
  }

  updateColumns() {
    if (this.formationsDemandees.length > 0) {
      const sampleGroup = this.formationsDemandees.at(0) as FormGroup;
      this.columns = Object.keys(sampleGroup.controls).filter(k => k !== 'id');
    }
  }

  get formationsDemandees(): FormArray {
    return this.form.get('formationsDemandees') as FormArray;
  }

  async saveDatas(): Promise<void> {
    this.formService.update({
      formationsDemandees: this.form.value.formationsDemandees,
    });

    const { id, formationsDemandees } = this.form.value;

    const step4Payload = {
      formationsDemandees,
    };

    await firstValueFrom(this.entretienStepsService.updateEntretienStep4(id, step4Payload));
  }
}
