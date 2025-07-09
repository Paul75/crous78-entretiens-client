import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FormsModule, ReactiveFormsModule, FormGroup } from '@angular/forms';

import { ButtonModule } from 'primeng/button';
import { FormProvider } from '../../providers/form.provider';
import { EntretienStepsService } from '@shared/services/entretiens/entretien-steps.service';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-entretien-pro-step6',
  imports: [CommonModule, FormsModule, ReactiveFormsModule, ButtonModule],
  providers: [],
  templateUrl: './step6.component.html',
  styleUrl: './step6.component.scss',
})
export class EntretienProStep6Component {
  form: FormGroup;

  private entretienStepsService = inject(EntretienStepsService);

  constructor(private formProvider: FormProvider) {
    this.form = this.formProvider.getForm();
  }

  async saveDatas(): Promise<void> {
    const { id, objectifsActivites, demarcheEnvisagee } = this.form.value;

    const step6Payload = {
      objectifsActivites,
      demarcheEnvisagee,
    };

    await firstValueFrom(this.entretienStepsService.updateEntretienStep6(id, step6Payload));
  }
}
