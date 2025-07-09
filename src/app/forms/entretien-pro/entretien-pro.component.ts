import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnChanges,
  OnInit,
  QueryList,
  SimpleChanges,
  ViewChild,
  ViewChildren,
} from '@angular/core';
import { CommonModule } from '@angular/common';

import { FormsModule, ReactiveFormsModule, FormGroup } from '@angular/forms';

import { StepItem, Stepper, StepperModule } from 'primeng/stepper';
import { ButtonModule } from 'primeng/button';
import { DrawerModule } from 'primeng/drawer';
import { FormProvider } from '../providers/form.provider';
import { EntretienProStep1Component } from './step1/step1.component';
import { EntretienProStep2Component } from './step2/step2.component';
import { EntretienProStep3Component } from './step3/step3.component';
import { EntretienProStep4Component } from './step4/step4.component';
import { EntretienProStep5Component } from './step5/step5.component';
import { EntretienProStep6Component } from './step6/step6.component';
import { EntretienProStep7Component } from './step7/step7.component';
import { EntretienProStep8Component } from './step8/step8.component';
import { ActivatedRoute, Router } from '@angular/router';
import { Entretien } from '@shared/models/entretien.model';
import { EntretienService } from '@shared/services/entretiens/entretien.service';
import { environment } from '@environments/environment';
import { StatutDemandeEnum } from '@shared/enums/statut.demande.enum';
import { DatePickerModule } from 'primeng/datepicker';
import { EntretienProProvider } from '@forms/providers/entretien-pro.provider';
import { transformDatesToDisplay } from '@shared/utils/dates.utils';
import { FormulaireService } from '@forms/services/formulaire.service';
import { ButtonGroupModule } from 'primeng/buttongroup';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-entretien-pro',
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    ButtonGroupModule,
    ButtonModule,
    StepperModule,
    DatePickerModule,
    ToastModule,
    DrawerModule,
    EntretienProStep1Component,
    EntretienProStep2Component,
    EntretienProStep3Component,
    EntretienProStep4Component,
    EntretienProStep5Component,
    EntretienProStep6Component,
    EntretienProStep7Component,
    EntretienProStep8Component,
  ],
  providers: [
    MessageService,
    EntretienProProvider,
    { provide: FormProvider, useExisting: EntretienProComponent },
  ],
  templateUrl: './entretien-pro.component.html',
  styleUrl: './entretien-pro.component.scss',
  changeDetection: ChangeDetectionStrategy.Default,
})
export class EntretienProComponent
  extends FormProvider
  implements OnInit, OnChanges, AfterViewInit
{
  name = environment.application.name;
  angular = environment.application.angular;
  bootstrap = environment.application.bootstrap;
  fontawesome = environment.application.fontawesome;

  displayId = false;

  today = new Date();
  minDate: Date = new Date(this.today.getFullYear(), this.today.getMonth(), this.today.getDate());

  typeForm = 'professionnel';

  // Utilisez ViewChildren au lieu de ViewChild
  @ViewChildren(EntretienProStep1Component)
  step1ChildComponents!: QueryList<EntretienProStep1Component>;

  @ViewChildren(EntretienProStep2Component)
  step2ChildComponents!: QueryList<EntretienProStep2Component>;

  @ViewChildren(EntretienProStep3Component)
  step3ChildComponents!: QueryList<EntretienProStep3Component>;

  @ViewChildren(EntretienProStep4Component)
  step4ChildComponents!: QueryList<EntretienProStep4Component>;

  @ViewChildren(EntretienProStep5Component)
  step5ChildComponents!: QueryList<EntretienProStep5Component>;

  @ViewChildren(EntretienProStep6Component)
  step6ChildComponents!: QueryList<EntretienProStep6Component>;

  @ViewChildren(EntretienProStep7Component)
  step7ChildComponents!: QueryList<EntretienProStep7Component>;

  entretienForm!: FormGroup;

  stepsCount = 0;
  currentStepIndex: number = 1;
  @ViewChild('stepper') stepper!: Stepper;
  @ViewChildren(StepItem) stepItems!: QueryList<StepItem>;
  private fromNextStep = false;

  constructor(
    private cdref: ChangeDetectorRef,
    private formulaireService: FormulaireService,
    private formProvider: EntretienProProvider,
    private entretienService: EntretienService,
    private route: ActivatedRoute,
    private router: Router,
    private messageService: MessageService,
  ) {
    super();
    this.entretienForm = this.formProvider.getForm();
  }

  ngOnInit() {
    this.currentStepIndex = 1;
    this.formulaireService.reset();
  }

  ngAfterViewInit(): void {
    this.stepsCount = this.stepItems.length;
    this.getEntretienById();
    this.cdref.detectChanges();
  }

  ngOnChanges(changes: SimpleChanges) {
    this.cdref.detectChanges();
  }

  ngAfterContentChecked() {
    this.cdref.detectChanges();
  }

  isLastStep(): boolean {
    return this.currentStepIndex === this.stepsCount;
  }

  goToAdminForm() {
    this.router.navigate(['/admin']);
  }

  goToPreviousStep() {
    if (this.currentStepIndex > 1) {
      this.currentStepIndex--;
    }
  }
  async goToNextStep() {
    if (!this.isLastStep()) {
      try {
        this.fromNextStep = true;
        await this.saveCurrentStep();
        this.currentStepIndex++;
      } catch (e) {
        console.error('Erreur lors de la sauvegarde', e);
        // éventuellement afficher un message à l'utilisateur
      }
    }
  }

  getEntretienById() {
    this.route.params.subscribe(params => {
      const id = params['id'];
      if (id !== undefined) {
        this.getEntretien(parseInt(id));
      }
    });
  }

  getEntretien(id: number): void {
    if (id !== 0) {
      this.entretienService.getEntretien(id).subscribe((item: Entretien) => {
        if (new Date(item.dateEntretien) < this.minDate) {
          item.dateEntretien = this.minDate.toDateString();
        }
        this.setForm(item);
        this.cdref.detectChanges();
      });
    }
  }

  getForm(): FormGroup {
    return this.entretienForm;
  }

  setForm(entretien: Entretien) {
    this.entretienForm.patchValue(entretien);
    transformDatesToDisplay(this.entretienForm);
  }

  getAgent() {
    return this.getForm().get('personne') as FormGroup;
  }
  getSuperieur() {
    return this.getForm().get('superieur') as FormGroup;
  }
  getPoste() {
    return this.getForm().get('conduiteProjet') as FormGroup;
  }
  getAcquisExperiencePro() {
    return this.getForm().get('acquisExperiencePro') as FormGroup;
  }
  getObjectifsFixes() {
    return this.getForm().get('objectifsFixes') as FormGroup;
  }

  async saveCurrentStep() {
    switch (this.currentStepIndex) {
      case 1:
        await this.step1ChildComponents.first.saveDatas();
        transformDatesToDisplay(this.entretienForm);
        break;
      case 2:
        await this.step2ChildComponents.first.saveDatas();
        transformDatesToDisplay(this.entretienForm);
        break;
      case 3:
        await this.step3ChildComponents.first.saveDatas();
        break;
      case 4:
        await this.step4ChildComponents.first.saveDatas();
        break;
      case 5:
        await this.step5ChildComponents.first.saveDatas();
        break;
      case 6:
        await this.step6ChildComponents.first.saveDatas();
        break;
      case 7:
        await this.step7ChildComponents.first.saveDatas();
        break;
    }
  }

  goSaveStep() {
    this.saveCurrentStep()
      .then(() => {
        this.messageService.add({
          severity: 'success',
          summary: 'Sauvegarde réussie',
          detail: 'Les données ont été sauvegardées avec succès.',
        });
      })
      .catch(error => {
        this.messageService.add({
          severity: 'error',
          summary: 'Erreur de sauvegarde',
          detail: 'Une erreur est survenue lors de la sauvegarde des données.',
        });
        console.error('Erreur de sauvegarde:', error);
      });
  }

  get boutonLabelSubmit(): string {
    const statut = this.entretienForm.value.statut;
    const statutsEnregistrer = [StatutDemandeEnum.PREPARE, StatutDemandeEnum.RDV];
    return statutsEnregistrer.includes(statut) ? 'ENREGISTRER' : 'VALIDER';
  }
}
