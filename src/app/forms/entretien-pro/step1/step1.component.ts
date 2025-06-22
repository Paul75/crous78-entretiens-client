import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FormsModule, ReactiveFormsModule, FormGroup, FormBuilder } from '@angular/forms';

import { NgbDatepickerModule } from '@ng-bootstrap/ng-bootstrap';
import { StepperModule } from 'primeng/stepper';
import { ButtonModule } from 'primeng/button';
import { FormProvider } from '../../providers/form.provider';
import { DatePickerModule } from 'primeng/datepicker';

@Component({
  selector: 'app-entretien-pro-step1',
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgbDatepickerModule,
    ButtonModule,
    StepperModule,
    DatePickerModule,
  ],
  templateUrl: './step1.component.html',
  styleUrl: './step1.component.scss',
})
export class EntretienProStep1Component {
  form: FormGroup;

  constructor(private formProvider: FormProvider) {
    this.form = this.formProvider.getForm();

    /*this.form.addControl(
      'personne',
      new FormBuilder().group({
        id: [DEFAULT_ENTRETIEN.personne.id],
        matricule: [DEFAULT_ENTRETIEN.personne.matricule],
        nomUsage: [DEFAULT_ENTRETIEN.personne.nomUsage],
        nom: [DEFAULT_ENTRETIEN.personne.nom],
        prenom: [DEFAULT_ENTRETIEN.personne.prenom],
        dateNaissance: [DEFAULT_ENTRETIEN.personne.dateNaissance],
        corpsGrade: [DEFAULT_ENTRETIEN.personne.corpsGrade],
        echelon: [DEFAULT_ENTRETIEN.personne.echelon],
        datePromotion: [DEFAULT_ENTRETIEN.personne.datePromotion],
        fonction: [DEFAULT_ENTRETIEN.personne.fonction],
        structure: [DEFAULT_ENTRETIEN.personne.structure],
        adresse: [DEFAULT_ENTRETIEN.personne.adresse],
      }),
    );

    this.form.addControl(
      'superieur',
      new FormBuilder().group({
        id: [DEFAULT_ENTRETIEN.superieur.id],
        matricule: [DEFAULT_ENTRETIEN.superieur.matricule],
        nomUsage: [DEFAULT_ENTRETIEN.superieur.nomUsage],
        nom: [DEFAULT_ENTRETIEN.superieur.nom],
        prenom: [DEFAULT_ENTRETIEN.superieur.prenom],
        dateNaissance: [DEFAULT_ENTRETIEN.superieur.dateNaissance],
        corpsGrade: [DEFAULT_ENTRETIEN.superieur.corpsGrade],
        echelon: [DEFAULT_ENTRETIEN.superieur.echelon],
        datePromotion: [DEFAULT_ENTRETIEN.superieur.datePromotion],
        fonction: [DEFAULT_ENTRETIEN.superieur.fonction],
        structure: [DEFAULT_ENTRETIEN.superieur.structure],
        adresse: [DEFAULT_ENTRETIEN.superieur.adresse],
      }),
    );

    // Abonnement aux données
    this.dataService.currentEntretien.subscribe(entretien => {
      if (entretien) {
        // 3. Patch des valeurs APRÈS ajout des contrôles
        this.form.patchValue({
          personne: entretien.personne,
          superieur: entretien.superieur,
        });
      }
    });*/
  }

  get registerFormControl() {
    return this.form.controls;
  }
}
