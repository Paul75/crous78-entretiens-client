import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FormsModule, ReactiveFormsModule, FormGroup } from '@angular/forms';

import { StepperModule } from 'primeng/stepper';
import { ButtonModule } from 'primeng/button';
import { FormProvider } from '../../providers/form.provider';
import { DatePickerModule } from 'primeng/datepicker';

@Component({
  selector: 'app-entretien-pro-step1',
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    ButtonModule,
    StepperModule,
    DatePickerModule,
  ],
  templateUrl: './step1.component.html',
  styleUrl: './step1.component.scss',
})
export class EntretienProStep1Component {
  form: FormGroup;

  constructor(private formProvider: FormProvider) {
    this.form = this.formProvider.getForm();
  }

  get registerFormControl() {
    return this.form.controls;
  }

  saveData() {
    // Save data for step 1
  }
}
