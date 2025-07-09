import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FormsModule, ReactiveFormsModule, FormGroup } from '@angular/forms';

import { ButtonModule } from 'primeng/button';
import { FormProvider } from '../../providers/form.provider';
import { ToggleButtonModule } from 'primeng/togglebutton';
import { DatePickerModule } from 'primeng/datepicker';
import { EntretienStepsService } from '@shared/services/entretiens/entretien-steps.service';
import { firstValueFrom } from 'rxjs';
import { transformDatesToBdd } from '@shared/utils/dates.utils';

@Component({
  selector: 'app-entretien-pro-step2',
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    ButtonModule,
    ToggleButtonModule,
    DatePickerModule,
  ],
  providers: [],
  templateUrl: './step2.component.html',
  styleUrl: './step2.component.scss',
})
export class EntretienProStep2Component {
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
      structure,
      intitulePoste,
      dateAffectation,
      emploiType,
      positionPoste,
      quotiteAffectation,
      missions,
      conduiteProjet,
      encadrement,
      cpeNbAgent,
      cpeCategA,
      cpeCategB,
      cpeCategC,
    } = this.form.value;

    const step2Payload = {
      structure,
      intitulePoste,
      dateAffectation,
      emploiType,
      positionPoste,
      quotiteAffectation,
      missions,
      conduiteProjet,
      encadrement,
      cpeNbAgent,
      cpeCategA,
      cpeCategB,
      cpeCategC,
    };

    await firstValueFrom(this.entretienStepsService.updateEntretienStep2(id, step2Payload));
  }
}
