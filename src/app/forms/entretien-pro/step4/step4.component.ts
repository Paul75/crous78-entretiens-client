import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FormsModule, ReactiveFormsModule, FormGroup } from '@angular/forms';

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
    ButtonModule,
    RadioButtonModule,
    StepperModule,
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
  }

  get registerFormControl() {
    return this.form.controls;
  }

  saveData() {
    // Save data for step 4
  }
}
