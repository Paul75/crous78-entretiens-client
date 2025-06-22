import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FormsModule, ReactiveFormsModule, FormGroup, FormControl } from '@angular/forms';

import { NgbDatepickerModule } from '@ng-bootstrap/ng-bootstrap';
import { StepperModule } from 'primeng/stepper';
import { ButtonModule } from 'primeng/button';
import { FormProvider } from '../../providers/form.provider';
import { DEFAULT_ENTRETIEN } from '@shared/constants/entretien.constants';
import { ToggleButtonModule } from 'primeng/togglebutton';

@Component({
  selector: 'app-entretien-pro-step2',
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgbDatepickerModule,
    StepperModule,
    ButtonModule,
    ToggleButtonModule,
    StepperModule,
  ],
  providers: [],
  templateUrl: './step2.component.html',
  styleUrl: './step2.component.scss',
})
export class EntretienProStep2Component {
  form: FormGroup;

  constructor(private formProvider: FormProvider) {
    this.form = this.formProvider.getForm();

    /*this.form.addControl('structure', new FormControl(DEFAULT_ENTRETIEN.structure));

    this.form.addControl('intitulePoste', new FormControl(DEFAULT_ENTRETIEN.intitulePoste));

    this.form.addControl('dateAffectation', new FormControl(DEFAULT_ENTRETIEN.dateAffectation));

    this.form.addControl('emploiType', new FormControl(DEFAULT_ENTRETIEN.emploiType));

    this.form.addControl('positionPoste', new FormControl(DEFAULT_ENTRETIEN.positionPoste));

    this.form.addControl(
      'quotiteAffectation',
      new FormControl(DEFAULT_ENTRETIEN.quotiteAffectation),
    );

    this.form.addControl('missions', new FormControl(DEFAULT_ENTRETIEN.missions));

    this.form.addControl('conduiteProjet', new FormControl(DEFAULT_ENTRETIEN.conduiteProjet));

    this.form.addControl('encadrement', new FormControl(DEFAULT_ENTRETIEN.encadrement));

    this.form.addControl('cpeNbAgent', new FormControl(DEFAULT_ENTRETIEN.cpeNbAgent));

    this.form.addControl('cpeCategA', new FormControl(DEFAULT_ENTRETIEN.cpeCategA));

    this.form.addControl('cpeCategB', new FormControl(DEFAULT_ENTRETIEN.cpeCategB));

    this.form.addControl('cpeCategC', new FormControl(DEFAULT_ENTRETIEN.cpeCategC));*/

    // Abonnement aux données
    /*this.dataService.currentEntretien.subscribe(entretien => {
      if (entretien) {
        // 3. Patch des valeurs APRÈS ajout des contrôles
        this.form.patchValue({
          structure: entretien.structure,
          intitulePoste: entretien.intitulePoste,
          dateAffectation: this.dateService.formatDateOrEmpty(entretien.dateAffectation),
          emploiType: entretien.emploiType,
          positionPoste: entretien.positionPoste,
          quotiteAffectation: entretien.quotiteAffectation,
          missions: entretien.missions,
          conduiteProjet: entretien.conduiteProjet,
          encadrement: entretien.encadrement,
          cpeNbAgent: entretien.cpeNbAgent,
          cpeCategA: entretien.cpeCategA,
          cpeCategB: entretien.cpeCategB,
          cpeCategC: entretien.cpeCategC,
        });
      }
    });*/
  }

  get registerFormControl() {
    return this.form.controls;
  }
}
