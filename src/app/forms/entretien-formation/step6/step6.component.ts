import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FormsModule, ReactiveFormsModule, FormGroup } from '@angular/forms';

import { ButtonModule } from 'primeng/button';
import { FormProvider } from '../../providers/form.provider';
import { TableModule } from 'primeng/table';
import { firstValueFrom } from 'rxjs';
import { EntretienStepsService } from '@shared/services/entretiens/entretien-steps.service';
import { EditorComponent } from '@shared/components/editor/editor.component';

@Component({
  selector: 'app-entretien-form-step6',
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    ButtonModule,
    TableModule,
    EditorComponent,
  ],
  providers: [],
  templateUrl: './step6.component.html',
  styleUrl: './step6.component.scss',
})
export class EntretienFormStep6Component {
  form: FormGroup;

  private entretienStepsService = inject(EntretienStepsService);

  constructor(private formProvider: FormProvider) {
    this.form = this.formProvider.getForm();
  }

  get registerFormControl() {
    return this.form.controls;
  }

  async saveDatas(): Promise<void> {
    //
    const { id, formationsPreparationConcours } = this.form.value;

    const step6Payload = {
      formationsPreparationConcours,
    };

    await firstValueFrom(this.entretienStepsService.updateEntretienStep6(id, step6Payload));
  }
}
