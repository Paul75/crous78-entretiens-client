import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FormsModule, ReactiveFormsModule, FormGroup } from '@angular/forms';

import { NgbDatepickerModule } from '@ng-bootstrap/ng-bootstrap';
import { StepperModule } from 'primeng/stepper';
import { ButtonModule } from 'primeng/button';
import { ToggleButtonModule } from 'primeng/togglebutton';
import { FormProvider } from '../../providers/form.provider';
import { DatePickerModule } from 'primeng/datepicker';

@Component({
  selector: 'app-entretien-form-step1',
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgbDatepickerModule,
    ButtonModule,
    StepperModule,
    DatePickerModule,
    ToggleButtonModule,
  ],
  templateUrl: './step1.component.html',
  styleUrl: './step1.component.scss',
})
export class EntretienFormStep1Component {
  form: FormGroup;

  constructor(private formProvider: FormProvider) {
    this.form = this.formProvider.getForm();
  }

  get registerFormControl() {
    return this.form.controls;
  }

  ngOnInit() {}
}
