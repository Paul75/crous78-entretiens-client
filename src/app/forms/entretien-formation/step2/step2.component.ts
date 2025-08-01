import { ChangeDetectorRef, Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';

import {
  FormsModule,
  ReactiveFormsModule,
  FormGroup,
  FormArray,
  FormBuilder,
} from '@angular/forms';

import { ButtonModule } from 'primeng/button';
import { ToggleButtonModule } from 'primeng/togglebutton';
import { FormProvider } from '../../providers/form.provider';
import { TableModule } from 'primeng/table';
import { InputNumberModule } from 'primeng/inputnumber';
import { FormulaireService } from '@forms/services/formulaire.service';
import { DatePickerModule } from 'primeng/datepicker';
import { InputMaskModule } from 'primeng/inputmask';
import { firstValueFrom } from 'rxjs';
import { EntretienStepsService } from '@shared/services/entretiens/entretien-steps.service';
import { transformDatesToBdd } from '@shared/utils/dates.utils';
import { Entretien } from '@shared/models/entretien.model';
import { FormationsDispensees } from '@shared/models/formations-dispensees.model';
import { EditorComponent } from '@shared/components/editor/editor.component';

@Component({
  selector: 'app-entretien-form-step2',
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    ButtonModule,
    InputNumberModule,
    InputMaskModule,
    TableModule,
    ToggleButtonModule,
    DatePickerModule,
    EditorComponent,
  ],
  providers: [],
  templateUrl: './step2.component.html',
  styleUrl: './step2.component.scss',
})
export class EntretienFormStep2Component {
  form: FormGroup;
  columnsFormationsDispensees: string[] = []; // Pour stocker les noms des colonnes dynamiques
  columnTypes: { [key: string]: string } = {
    annee: 'numberYear',
    disciplineFormation: 'string',
    titreFormation: 'string',
  };

  columnLabels: { [key: string]: string } = {
    annee: 'Année',
    disciplineFormation: 'Discipline de formation',
    titreFormation: 'Titre de la (des) formation(s) animée(s) et organisme(s) concerné(s)',
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
    if (entretien?.formationsDispensees) {
      this.initializeFormationsDispensees(entretien.formationsDispensees);
    }
  }

  private initializeFormationsDispensees(formationsDispensees?: FormationsDispensees[]) {
    if (!this.form.contains('formationsDispensees')) {
      this.form.addControl('formationsDispensees', this.fb.array([]));
    }

    const array = this.formationsDispensees;
    array.clear();

    const saved = this.formService.getCurrentValue().formationsDispensees;

    const source = saved.length ? saved : formationsDispensees;

    if (source?.length) {
      source.forEach(item => {
        array.push(this.fb.group({ ...item }));
      });
    } else {
      this.addFormationsDispensees();
    }

    this.updateColumnsFormationsDispensees();
    this.cdref.detectChanges();

    /*saved.forEach((formation?: any) => {
        array.push(
          this.fb.group({
            annee: [formation.annee],
            disciplineFormation: [formation.disciplineFormation],
            titreFormation: [formation.titreFormation],
          }),
        );
      });*/
  }

  get registerFormControl() {
    return this.form.controls;
  }

  addFormationsDispensees() {
    this.formationsDispensees.push(
      this.fb.group({
        annee: [null],
        disciplineFormation: [null],
        titreFormation: [null],
      }),
    );
  }

  removeFormation(index: number) {
    this.formationsDispensees.removeAt(index);

    if (this.formationsDispensees.length == 0) {
      this.addFormationsDispensees();
    }
  }

  updateColumnsFormationsDispensees() {
    if (this.formationsDispensees.length > 0) {
      const sampleGroup = this.formationsDispensees.at(0) as FormGroup;
      this.columnsFormationsDispensees = Object.keys(sampleGroup.controls).filter(k => k !== 'id');
    }
  }

  get formationsDispensees(): FormArray {
    return this.form.get('formationsDispensees') as FormArray;
  }

  async saveDatas(): Promise<void> {
    transformDatesToBdd(this.form);
    this.formService.update({
      formationsDispensees: this.form.value.formationsDispensees,
    });

    const {
      id,
      structure,
      intitulePoste,
      dateAffectation,
      emploiType,
      positionPoste,
      quotiteAffectation,
      missions,
      conduiteProjet,
      encadrement,
      cpeNbAgent,
      cpeCategA,
      cpeCategB,
      cpeCategC,
      competenceTransferFormateur,
      competenceTransferTuteur,
      competenceTransferPresident,
      competenceTransferMembre,
      formationsDispensees,
    } = this.form.value;

    const step2Payload = {
      structure,
      intitulePoste,
      dateAffectation,
      emploiType,
      positionPoste,
      quotiteAffectation,
      missions,
      conduiteProjet,
      encadrement,
      cpeNbAgent,
      cpeCategA,
      cpeCategB,
      cpeCategC,
      competenceTransferFormateur,
      competenceTransferTuteur,
      competenceTransferPresident,
      competenceTransferMembre,
      formationsDispensees,
    };

    await firstValueFrom(this.entretienStepsService.updateEntretienStep2(id, step2Payload));
  }
}
