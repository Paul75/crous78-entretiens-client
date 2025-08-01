import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FormsModule, ReactiveFormsModule, FormGroup } from '@angular/forms';

import { ButtonModule } from 'primeng/button';
import { FormProvider } from '../../providers/form.provider';
import { AppreciationGeneraleEnum } from '@shared/enums/appreciation_generale.enum';
import { RadioButtonModule } from 'primeng/radiobutton';
import { EntretienStepsService } from '@shared/services/entretiens/entretien-steps.service';
import { firstValueFrom } from 'rxjs';
import { EditorComponent } from '@shared/components/editor/editor.component';

@Component({
  selector: 'app-entretien-pro-step4',
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    ButtonModule,
    RadioButtonModule,
    EditorComponent,
  ],
  providers: [],
  templateUrl: './step4.component.html',
  styleUrl: './step4.component.scss',
})
export class EntretienProStep4Component {
  appreciationGenerale: typeof AppreciationGeneraleEnum = AppreciationGeneraleEnum;
  form: FormGroup;

  private entretienStepsService = inject(EntretienStepsService);

  constructor(private formProvider: FormProvider) {
    this.form = this.formProvider.getForm();
  }

  get registerFormControl() {
    return this.form.controls;
  }

  async saveDatas(): Promise<void> {
    const {
      id,
      caCompetences,
      caContribution,
      caCapacites,
      caAptitude,
      agCompetences,
      agContribution,
      agCapacites,
      agAptitude,
      realisationObjectifs,
      appreciationLitterale,
    } = this.form.value;

    const step4Payload = {
      caCompetences,
      caContribution,
      caCapacites,
      caAptitude,
      agCompetences,
      agContribution,
      agCapacites,
      agAptitude,
      realisationObjectifs,
      appreciationLitterale,
    };

    await firstValueFrom(this.entretienStepsService.updateEntretienStep4(id, step4Payload));
  }
}
