import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FormsModule, ReactiveFormsModule, FormGroup, FormControl } from '@angular/forms';

import { NgbDatepickerModule } from '@ng-bootstrap/ng-bootstrap';
import { StepperModule } from 'primeng/stepper';
import { ButtonModule } from 'primeng/button';
import { FormProvider } from '../../providers/form.provider';
import { TableModule } from 'primeng/table';
import { TextareaModule } from 'primeng/textarea';

@Component({
  selector: 'app-entretien-form-step6',
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgbDatepickerModule,
    ButtonModule,
    StepperModule,
    TableModule,
    TextareaModule,
  ],
  providers: [],
  templateUrl: './step6.component.html',
  styleUrl: './step6.component.scss',
})
export class EntretienFormStep6Component {
  form: FormGroup;

  constructor(private formProvider: FormProvider) {
    this.form = this.formProvider.getForm();

    this.form.addControl('formationsPreparationConcours', new FormControl(''));
  }

  get registerFormControl() {
    return this.form.controls;
  }
}
