import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FormsModule, ReactiveFormsModule, FormGroup } from '@angular/forms';

import { ButtonModule } from 'primeng/button';
import { FormProvider } from '../../providers/form.provider';
import { EntretienStepsService } from '@shared/services/entretiens/entretien-steps.service';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-entretien-pro-step5',
  imports: [CommonModule, FormsModule, ReactiveFormsModule, ButtonModule],
  providers: [],
  templateUrl: './step5.component.html',
  styleUrl: './step5.component.scss',
})
export class EntretienProStep5Component {
  form: FormGroup;

  private entretienStepsService = inject(EntretienStepsService);

  constructor(private formProvider: FormProvider) {
    this.form = this.formProvider.getForm();
  }

  get registerFormControl() {
    return this.form.controls;
  }

  async saveDatas(): Promise<void> {
    const { id, acquisExperiencePro } = this.form.value;

    const step5Payload = {
      acquisExperiencePro,
    };

    await firstValueFrom(this.entretienStepsService.updateEntretienStep5(id, step5Payload));
  }
}
