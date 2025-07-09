import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FormsModule, ReactiveFormsModule, FormGroup } from '@angular/forms';

import { ButtonModule } from 'primeng/button';
import { ToggleButtonModule } from 'primeng/togglebutton';
import { FormProvider } from '../../providers/form.provider';
import { DatePickerModule } from 'primeng/datepicker';
import { InputNumberModule } from 'primeng/inputnumber';
import { EntretienStepsService } from '@shared/services/entretiens/entretien-steps.service';
import { firstValueFrom } from 'rxjs';
import { transformDatesToBdd } from '@shared/utils/dates.utils';

@Component({
  selector: 'app-entretien-form-step1',
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    ButtonModule,
    DatePickerModule,
    InputNumberModule,
    ToggleButtonModule,
  ],
  templateUrl: './step1.component.html',
  styleUrl: './step1.component.scss',
})
export class EntretienFormStep1Component {
  form: FormGroup;

  private entretienStepsService = inject(EntretienStepsService);

  constructor(private formProvider: FormProvider) {
    this.form = this.formProvider.getForm();
  }

  get registerFormControl() {
    return this.form.controls;
  }

  async saveDatas(): Promise<void> {
    transformDatesToBdd(this.form);

    const {
      id,
      personne,
      superieur,
      dateEntretien,
      dateEntretienPrecedent,
      soldeCPF,
      utiliserCPF,
    } = this.form.value;

    const step1Payload = {
      personne,
      superieur,
      dateEntretien,
      dateEntretienPrecedent,
      soldeCPF,
      utiliserCPF,
    };

    await firstValueFrom(this.entretienStepsService.updateEntretienStep1(id, step1Payload));
  }
}
