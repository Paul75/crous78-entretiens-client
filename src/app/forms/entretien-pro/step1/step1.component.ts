import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FormsModule, ReactiveFormsModule, FormGroup } from '@angular/forms';

import { ButtonModule } from 'primeng/button';
import { FormProvider } from '../../providers/form.provider';
import { DatePickerModule } from 'primeng/datepicker';
import { transformDatesToBdd } from '@shared/utils/dates.utils';
import { firstValueFrom } from 'rxjs';
import { EntretienStepsService } from '@shared/services/entretiens/entretien-steps.service';

@Component({
  selector: 'app-entretien-pro-step1',
  imports: [CommonModule, FormsModule, ReactiveFormsModule, ButtonModule, DatePickerModule],
  templateUrl: './step1.component.html',
  styleUrl: './step1.component.scss',
})
export class EntretienProStep1Component {
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

    const { id, personne, superieur, dateEntretien } = this.form.value;

    const step1Payload = {
      personne,
      superieur,
      dateEntretien,
    };

    await firstValueFrom(this.entretienStepsService.updateEntretienStep1(id, step1Payload));
  }
}
