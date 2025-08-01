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
  selector: 'app-entretien-form-step7',
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    ButtonModule,
    TableModule,
    EditorComponent,
  ],
  providers: [],
  templateUrl: './step7.component.html',
  styleUrl: './step7.component.scss',
})
export class EntretienFormStep7Component {
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
    const { id, formationsConstruireProjet } = this.form.value;

    const step7Payload = {
      formationsConstruireProjet,
    };

    await firstValueFrom(this.entretienStepsService.updateEntretienStep7(id, step7Payload));
  }
}
