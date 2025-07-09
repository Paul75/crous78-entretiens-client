import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FormsModule, ReactiveFormsModule, FormGroup } from '@angular/forms';

import { ButtonModule } from 'primeng/button';
import { FormProvider } from '../../providers/form.provider';
import { EntretienStepsService } from '@shared/services/entretiens/entretien-steps.service';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-entretien-pro-step3',
  imports: [CommonModule, FormsModule, ReactiveFormsModule, ButtonModule],
  providers: [],
  templateUrl: './step3.component.html',
  styleUrl: './step3.component.scss',
})
export class EntretienProStep3Component {
  form: FormGroup;

  private entretienStepsService = inject(EntretienStepsService);

  constructor(private formProvider: FormProvider) {
    this.form = this.formProvider.getForm();
  }

  get registerFormControl() {
    return this.form.controls;
  }

  async saveDatas(): Promise<void> {
    const { id, rappelObjectifs, evenementsSurvenus } = this.form.value;

    const step3Payload = {
      rappelObjectifs,
      evenementsSurvenus,
    };

    await firstValueFrom(this.entretienStepsService.updateEntretienStep3(id, step3Payload));
  }
}
