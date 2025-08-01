import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ComponentRef,
  OnChanges,
  OnInit,
  QueryList,
  SimpleChanges,
  Type,
  ViewChild,
  ViewChildren,
  ViewContainerRef,
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
  displayId = false;

  today = new Date();
  minDate: Date = new Date(this.today.getFullYear(), this.today.getMonth(), this.today.getDate());

  typeForm = 'professionnel';

  entretienForm!: FormGroup;

  stepsCount = 0;
  currentStepIndex: number = 1;

  @ViewChild('dynamicStepContainer', { read: ViewContainerRef, static: false })
  dynamicStepContainer!: ViewContainerRef;

  currentStepComponentRef: ComponentRef<any> | null = null;

  steps: { value: number; label: string; component: Type<any> }[] = [
    { value: 1, label: 'Informations générales', component: EntretienProStep1Component },
    {
      value: 2,
      label: "DESCRIPTION DU POSTE OCCUPE PAR L'AGENT",
      component: EntretienProStep2Component,
    },
    { value: 3, label: "EVALUATION DE L'ANNEE ECOULEE", component: EntretienProStep3Component },
    {
      value: 4,
      label: 'VALEUR PROFESSIONNELLE ET MANIERE DE SERVIR DU FONCTIONNAIRE',
      component: EntretienProStep4Component,
    },
    {
      value: 5,
      label: 'ACQUIS DE L’EXPERIENCE PROFESSIONNELLE',
      component: EntretienProStep5Component,
    },
    {
      value: 6,
      label: "OBJECTIFS FIXES POUR L'ANNEE A VENIR",
      component: EntretienProStep6Component,
    },
    {
      value: 7,
      label: "PERSPECTIVES D'EVOLUTION PROFESSIONNELLE",
      component: EntretienProStep7Component,
    },
    { value: 8, label: 'ENTRETIEN TERMINE', component: EntretienProStep8Component },
  ];

  activateNavClick = true;

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

    this.loadCurrentStepComponent();
    this.cdref.detectChanges();
  }

  ngOnChanges(changes: SimpleChanges) {
    this.cdref.detectChanges();
  }

  ngAfterContentChecked() {
    this.cdref.detectChanges();
  }

  loadCurrentStepComponent() {
    this.dynamicStepContainer.clear();
    const step = this.steps.find(s => s.value === this.currentStepIndex);

    if (step) {
      const componentRef = this.dynamicStepContainer.createComponent(step.component);
      this.currentStepComponentRef = componentRef;
    }
  }

  get currentStepComponent() {
    const step = this.steps.find(s => s.value === this.currentStepIndex);
    return step ? step.component : null;
  }

  async goToPreviousStep() {
    if (this.currentStepIndex > 1) {
      await this.saveCurrentStep();
      this.currentStepIndex--;

      this.loadCurrentStepComponent();
    }
  }

  async goToNextStep() {
    if (!this.isLastStep()) {
      try {
        this.fromNextStep = true;
        await this.saveCurrentStep();
        this.currentStepIndex++;

        this.loadCurrentStepComponent();
        this.cdref.detectChanges(); // force la mise à jour visuelle immédiatement
      } catch (e) {
        console.error('Erreur lors de la sauvegarde', e);
        // éventuellement afficher un message à l'utilisateur
      }
    }
  }

  async goToStep(step: number) {
    if (this.activateNavClick && !this.isLastStep()) {
      try {
        this.fromNextStep = true;
        await this.saveCurrentStep();

        this.currentStepIndex = step;

        this.loadCurrentStepComponent();
        this.cdref.detectChanges(); // force la mise à jour visuelle immédiatement
      } catch (e) {
        console.error('Erreur lors de la sauvegarde', e);
        // éventuellement afficher un message à l'utilisateur
      }
    }
  }

  isLastStep(): boolean {
    return this.currentStepIndex === this.stepsCount;
  }

  goToAdminForm() {
    this.router.navigate(['/admin']);
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
    const instance = this.currentStepComponentRef?.instance as any;
    if (instance?.saveDatas) {
      await instance.saveDatas();
      transformDatesToDisplay(this.entretienForm);
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
}
