import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FormsModule, ReactiveFormsModule, FormGroup } from '@angular/forms';

import { StepperModule } from 'primeng/stepper';
import { ButtonModule } from 'primeng/button';
import { FormProvider } from '../../providers/form.provider';

@Component({
  selector: 'app-entretien-pro-step3',
  imports: [CommonModule, FormsModule, ReactiveFormsModule, ButtonModule, StepperModule],
  providers: [],
  templateUrl: './step3.component.html',
  styleUrl: './step3.component.scss',
})
export class EntretienProStep3Component {
  form: FormGroup;

  constructor(private formProvider: FormProvider) {
    this.form = this.formProvider.getForm();
  }

  get registerFormControl() {
    return this.form.controls;
  }

  saveData() {
    // Save data for step 3
  }
}
