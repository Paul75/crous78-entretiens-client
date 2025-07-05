import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FormsModule, ReactiveFormsModule, FormGroup } from '@angular/forms';

import { StepperModule } from 'primeng/stepper';
import { ButtonModule } from 'primeng/button';
import { FormProvider } from '../../providers/form.provider';
import { TableModule } from 'primeng/table';
import { TextareaModule } from 'primeng/textarea';

@Component({
  selector: 'app-entretien-form-step7',
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    ButtonModule,
    StepperModule,
    TableModule,
    TextareaModule,
  ],
  providers: [],
  templateUrl: './step7.component.html',
  styleUrl: './step7.component.scss',
})
export class EntretienFormStep7Component {
  form: FormGroup;

  constructor(private formProvider: FormProvider) {
    this.form = this.formProvider.getForm();

    // this.form.addControl('formationsConstruireProjet', new FormControl(''));
  }

  get registerFormControl() {
    return this.form.controls;
  }
}
