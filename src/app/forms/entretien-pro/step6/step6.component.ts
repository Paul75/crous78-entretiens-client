import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FormsModule, ReactiveFormsModule, FormGroup } from '@angular/forms';

import { NgbDatepickerModule } from '@ng-bootstrap/ng-bootstrap';
import { StepperModule } from 'primeng/stepper';
import { ButtonModule } from 'primeng/button';
import { FormProvider } from '../../providers/form.provider';

@Component({
  selector: 'app-entretien-pro-step6',
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgbDatepickerModule,
    ButtonModule,
    StepperModule /*, RouterLink*/,
  ],
  providers: [],
  templateUrl: './step6.component.html',
  styleUrl: './step6.component.scss',
})
export class EntretienProStep6Component {
  form: FormGroup;

  constructor(private formProvider: FormProvider) {
    this.form = this.formProvider.getForm();

    /*// 5
    this.form.addControl(
      'objectifsActivites',
      new FormControl(DEFAULT_ENTRETIEN.objectifsActivites),
    );
    this.form.addControl('demarcheEnvisagee', new FormControl(DEFAULT_ENTRETIEN.demarcheEnvisagee));*/
  }

  get registerFormControl() {
    return this.form.controls;
  }
}
