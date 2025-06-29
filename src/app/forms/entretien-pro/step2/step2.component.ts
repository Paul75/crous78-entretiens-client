import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FormsModule, ReactiveFormsModule, FormGroup } from '@angular/forms';

import { StepperModule } from 'primeng/stepper';
import { ButtonModule } from 'primeng/button';
import { FormProvider } from '../../providers/form.provider';
import { ToggleButtonModule } from 'primeng/togglebutton';
import { DatePickerModule } from 'primeng/datepicker';

@Component({
  selector: 'app-entretien-pro-step2',
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    StepperModule,
    ButtonModule,
    ToggleButtonModule,
    StepperModule,
    DatePickerModule,
  ],
  providers: [],
  templateUrl: './step2.component.html',
  styleUrl: './step2.component.scss',
})
export class EntretienProStep2Component {
  form: FormGroup;

  constructor(private formProvider: FormProvider) {
    this.form = this.formProvider.getForm();
  }

  get registerFormControl() {
    return this.form.controls;
  }
}
