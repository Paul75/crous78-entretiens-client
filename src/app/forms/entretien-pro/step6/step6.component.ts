import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FormsModule, ReactiveFormsModule, FormGroup } from '@angular/forms';

import { StepperModule } from 'primeng/stepper';
import { ButtonModule } from 'primeng/button';
import { FormProvider } from '../../providers/form.provider';

@Component({
  selector: 'app-entretien-pro-step6',
  imports: [CommonModule, FormsModule, ReactiveFormsModule, ButtonModule, StepperModule],
  providers: [],
  templateUrl: './step6.component.html',
  styleUrl: './step6.component.scss',
})
export class EntretienProStep6Component {
  form: FormGroup;

  constructor(private formProvider: FormProvider) {
    this.form = this.formProvider.getForm();
  }

  saveData() {
    // Save data for step 6
  }
}
