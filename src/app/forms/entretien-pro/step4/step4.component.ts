import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FormsModule, ReactiveFormsModule, FormGroup, FormControl } from '@angular/forms';

import { NgbDatepickerModule } from '@ng-bootstrap/ng-bootstrap';
import { StepperModule } from 'primeng/stepper';
import { ButtonModule } from 'primeng/button';
import { FormProvider } from '../../providers/form.provider';
import { AppreciationGeneraleEnum } from '@shared/enums/appreciation_generale.enum';
import { RadioButtonModule } from 'primeng/radiobutton';

@Component({
  selector: 'app-entretien-pro-step4',
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgbDatepickerModule,
    ButtonModule,
    RadioButtonModule,
    StepperModule /*, RouterLink*/,
  ],
  providers: [],
  templateUrl: './step4.component.html',
  styleUrl: './step4.component.scss',
})
export class EntretienProStep4Component {
  appreciationGenerale: typeof AppreciationGeneraleEnum = AppreciationGeneraleEnum;
  form: FormGroup;

  constructor(private formProvider: FormProvider) {
    this.form = this.formProvider.getForm();

    /*
    // 3
    // 3.1
    this.form.addControl('caCompetences', new FormControl(DEFAULT_ENTRETIEN.caCompetences));
    this.form.addControl('caContribution', new FormControl(DEFAULT_ENTRETIEN.caContribution));
    this.form.addControl('caCapacites', new FormControl(DEFAULT_ENTRETIEN.caCapacites));
    this.form.addControl('caAptitude', new FormControl(DEFAULT_ENTRETIEN.caAptitude));

    // 3.2
    this.form.addControl('agCompetences', new FormControl(DEFAULT_ENTRETIEN.agCompetences));
    this.form.addControl('agContribution', new FormControl(DEFAULT_ENTRETIEN.agContribution));
    this.form.addControl('agCapacites', new FormControl(DEFAULT_ENTRETIEN.agCapacites));
    this.form.addControl('agAptitude', new FormControl(DEFAULT_ENTRETIEN.agAptitude));

    this.form.addControl(
      'realisationObjectifs',
      new FormControl(DEFAULT_ENTRETIEN.realisationObjectifs),
    );
    this.form.addControl(
      'appreciationLitterale',
      new FormControl(DEFAULT_ENTRETIEN.appreciationLitterale),
    );*/
  }

  get registerFormControl() {
    return this.form.controls;
  }
}
