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
import { SelectModule } from 'primeng/select';
import { FormulaireService } from '@forms/services/formulaire.service';
import { EntretienStepsService } from '@shared/services/entretiens/entretien-steps.service';
import { firstValueFrom } from 'rxjs';
import { FormationsContinue } from '@shared/models/formations-continue.model';
import { Entretien } from '@shared/models/entretien.model';
import { ActionsFormationsDemandees } from '@shared/models/ actions-formations-demandees.model';

@Component({
  selector: 'app-entretien-form-step5',
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    ButtonModule,
    InputNumberModule,
    TableModule,
    SelectModule,
  ],
  providers: [],
  templateUrl: './step5.component.html',
  styleUrl: './step5.component.scss',
})
export class EntretienFormStep5Component {
  form: FormGroup;

  initiative = ['agent', 'administration'];

  columns: string[] = []; // Pour stocker les noms des colonnes dynamiques

  columnTypes: { [key: string]: string } = {
    libelleFormation: 'string',
    finalite: 'string',
    initiativeDemande: 'select',
    duree: 'string',
    motivationResponsable: 'string',
  };

  columnLabels: { [key: string]: string } = {
    libelleFormation: 'Libellé de la formation',
    finalite: 'Finalité (action de formation de type 1, 2 ou 3)',
    initiativeDemande:
      "Demande à l`initiative de :<br /><ul><li>l'agent</li><li>l'administration</li></ul>",
    duree: 'Durée',
  };

  columnsFormationsDemandees: string[] = []; // Pour stocker les noms des colonnes dynamiques
  columnLabelsFormationsDemandees: { [key: string]: string } = {
    libelleFormation: 'Libellé de la formation',
    motivationResponsable: "Motivation du responsable conduisant l'entretien (si avis défavorable)",
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
    if (entretien?.formationsContinue) {
      this.initializeFormationsContinue(entretien.formationsContinue);
    }
    if (entretien?.actionsFormationsDemandees) {
      this.initializeActionFormDemandeesWithData(entretien.actionsFormationsDemandees);
    }
  }

  private initializeFormationsContinue(formationsContinue?: FormationsContinue[]) {
    if (!this.form.contains('formationsContinue')) {
      this.form.addControl('formationsContinue', this.fb.array([]));
    }

    const array = this.formationsContinue;
    array.clear();

    const saved = this.formService.getCurrentValue().formationsContinue;

    const source = saved.length ? saved : formationsContinue;

    if (source?.length) {
      source.forEach(item => {
        array.push(this.fb.group({ ...item }));
      });
    } else {
      this.addFormationContinue();
    }

    this.updateColumns();
    this.cdref.detectChanges();
  }

  private initializeActionFormDemandeesWithData(
    actionsFormationsDemandees?: ActionsFormationsDemandees[],
  ) {
    if (!this.form.contains('actionsFormationsDemandees')) {
      this.form.addControl('actionsFormationsDemandees', this.fb.array([]));
    }

    const array = this.actionsFormationsDemandees;
    array.clear();

    const saved = this.formService.getCurrentValue().actionsFormationsDemandees;

    const source = saved.length ? saved : actionsFormationsDemandees;

    if (source?.length) {
      source.forEach(item => {
        array.push(this.fb.group({ ...item }));
      });
    } else {
      this.addActionFormationDemandees();
    }

    this.updateColumnsFormationsDemandees();
    this.cdref.detectChanges();
  }

  get registerFormControl() {
    return this.form.controls;
  }

  addFormationContinue() {
    this.formationsContinue.push(
      this.fb.group({
        libelleFormation: [null],
        finalite: [null],
        initiativeDemande: [null],
        duree: [null],
      }),
    );
  }

  removeFormation(index: number) {
    this.formationsContinue.removeAt(index);
    if (this.formationsContinue.length == 0) {
      this.addFormationContinue();
    }
  }

  updateColumns() {
    if (this.formationsContinue.length > 0) {
      const sampleGroup = this.formationsContinue.at(0) as FormGroup;
      this.columns = Object.keys(sampleGroup.controls).filter(k => k !== 'id');
    }
  }

  addActionFormationDemandees() {
    this.actionsFormationsDemandees.push(
      this.fb.group({
        libelleFormation: [null],
        motivationResponsable: [null],
      }),
    );
  }

  updateColumnsFormationsDemandees() {
    if (this.actionsFormationsDemandees.length > 0) {
      const sampleGroup = this.actionsFormationsDemandees.at(0) as FormGroup;
      this.columnsFormationsDemandees = Object.keys(sampleGroup.controls).filter(k => k !== 'id');
    }
  }

  removeFormationsDemandees(index: number) {
    this.actionsFormationsDemandees.removeAt(index);
    if (this.actionsFormationsDemandees.length == 0) {
      this.addActionFormationDemandees();
    }
  }

  get formationsContinue(): FormArray {
    return this.form.get('formationsContinue') as FormArray;
  }

  get actionsFormationsDemandees(): FormArray {
    return this.form.get('actionsFormationsDemandees') as FormArray;
  }

  async saveDatas(): Promise<void> {
    this.formService.update({
      formationsContinue: this.form.value.formationsContinue,
      actionsFormationsDemandees: this.form.value.actionsFormationsDemandees,
    });

    const { id, formationsContinue, actionsFormationsDemandees } = this.form.value;

    const step5Payload = {
      formationsContinue,
      actionsFormationsDemandees,
    };

    await firstValueFrom(this.entretienStepsService.updateEntretienStep5(id, step5Payload));
  }
}
