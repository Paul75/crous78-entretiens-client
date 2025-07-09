import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FormsModule, ReactiveFormsModule, FormGroup } from '@angular/forms';

import { ButtonModule } from 'primeng/button';
import { FormProvider } from '../../providers/form.provider';
import { EntretienStepsService } from '@shared/services/entretiens/entretien-steps.service';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-entretien-pro-step7',
  imports: [CommonModule, FormsModule, ReactiveFormsModule, ButtonModule],
  providers: [],
  templateUrl: './step7.component.html',
  styleUrl: './step7.component.scss',
})
export class EntretienProStep7Component {
  form: FormGroup;

  private entretienStepsService = inject(EntretienStepsService);

  constructor(private formProvider: FormProvider) {
    this.form = this.formProvider.getForm();
  }

  get registerFormControl() {
    return this.form.controls;
  }

  async saveDatas(): Promise<void> {
    const { id, evolutionActivites, evolutionCarriere } = this.form.value;

    const step7Payload = {
      evolutionActivites,
      evolutionCarriere,
    };

    await firstValueFrom(this.entretienStepsService.updateEntretienStep7(id, step7Payload));
  }
}
