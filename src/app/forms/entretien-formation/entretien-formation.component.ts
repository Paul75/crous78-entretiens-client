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
import { FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { EntretienService } from '@shared/services/entretiens/entretien.service';
import { ActivatedRoute, Router } from '@angular/router';
import { FormProvider } from '@forms/providers/form.provider';
import { Entretien } from '@shared/models/entretien.model';
import { ButtonModule } from 'primeng/button';
import { DrawerModule } from 'primeng/drawer';
import { StepItem, Stepper, StepperModule } from 'primeng/stepper';
import { EntretienFormStep1Component } from './step1/step1.component';
import { EntretienFormStep2Component } from './step2/step2.component';
import { EntretienFormStep3Component } from './step3/step3.component';
import { EntretienFormStep4Component } from './step4/step4.component';
import { EntretienFormStep5Component } from './step5/step5.component';
import { EntretienFormStep6Component } from './step6/step6.component';
import { EntretienFormStep7Component } from './step7/step7.component';
import { EntretienFormStep8Component } from './step8/step8.component';
import { DatePickerModule } from 'primeng/datepicker';
import { EntretienFormProvider } from '@forms/providers/entretien-form.provider';
import { transformDatesToDisplay } from '@shared/utils/dates.utils';
import { FormulaireService } from '@forms/services/formulaire.service';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { ButtonGroupModule } from 'primeng/buttongroup';

interface InitializableComponent {
  initialize: (entretien: Entretien) => void;
}

@Component({
  selector: 'app-entretien-formation',
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    ButtonGroupModule,
    ButtonModule,
    StepperModule,
    DatePickerModule,
    DrawerModule,
    ToastModule,
  ],
  providers: [
    MessageService,
    EntretienFormProvider,
    { provide: FormProvider, useExisting: EntretienFormationComponent },
  ],
  templateUrl: './entretien-formation.component.html',
  styleUrl: './entretien-formation.component.scss',
  changeDetection: ChangeDetectionStrategy.Default,
})
export class EntretienFormationComponent
  extends FormProvider
  implements OnInit, OnChanges, AfterViewInit
{
  today = new Date();
  minDate: Date = new Date(this.today.getFullYear(), this.today.getMonth(), this.today.getDate());

  typeForm = 'formation';

  private entretienData?: Entretien;

  entretienForm!: FormGroup;

  stepsCount = 0;
  currentStepIndex: number = 1;

  @ViewChild('dynamicStepContainer', { read: ViewContainerRef, static: false })
  dynamicStepContainer!: ViewContainerRef;

  currentStepComponentRef: ComponentRef<any> | null = null;

  steps: { value: number; label: string; component: Type<any> }[] = [
    { value: 1, label: 'Informations générales', component: EntretienFormStep1Component },
    {
      value: 2,
      label: "DESCRIPTION DU POSTE OCCUPE PAR L'AGENT",
      component: EntretienFormStep2Component,
    },
    {
      value: 3,
      label: 'BILAN DES FORMATIONS ET BESOINS DE FORMATION',
      component: EntretienFormStep3Component,
    },
    {
      value: 4,
      label: 'FORMATIONS DEMANDEES SUR LA PERIODE ECOULEE ET NON SUIVIES',
      component: EntretienFormStep4Component,
    },
    {
      value: 5,
      label: 'FORMATIONS DEMANDEES POUR LA NOUVELLE PERIODE',
      component: EntretienFormStep5Component,
    },
    {
      value: 6,
      label: 'FORMATION DE PREPARATION A UN CONCOURS OU EXAMEN PROFESSIONNEL',
      component: EntretienFormStep6Component,
    },
    {
      value: 7,
      label: 'FORMATIONS POUR CONSTRUIRE UN PROJET PERSONNEL A CARACTERE PROFESSIONNEL',
      component: EntretienFormStep7Component,
    },
    { value: 8, label: 'ENTRETIEN TERMINE', component: EntretienFormStep8Component },
  ];

  activateNavClick = true;

  @ViewChild('stepper') stepper!: Stepper;
  @ViewChildren(StepItem) stepItems!: QueryList<StepItem>;
  private fromNextStep = false;

  /**
   *  CODE GENERAL
   */

  constructor(
    private cdref: ChangeDetectorRef,
    private entretienService: EntretienService,
    private formulaireService: FormulaireService,
    private formProvider: EntretienFormProvider,
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

      const instance = componentRef.instance as InitializableComponent;
      if (this.entretienData && instance.initialize && typeof instance.initialize === 'function') {
        instance.initialize(this.entretienData);
      }
    }
  }

  get currentStepComponent() {
    const step = this.steps.find(s => s.value === this.currentStepIndex);
    return step ? step.component : null;
  }

  goToPreviousStep() {
    if (this.currentStepIndex > 1) {
      this.currentStepIndex--;

      this.loadCurrentStepComponent();
      this.cdref.detectChanges(); // force la mise à jour visuelle immédiatement
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
    this.entretienData = entretien;
    this.entretienForm.patchValue(entretien);
    transformDatesToDisplay(this.entretienForm);

    // Si un composant est déjà chargé, on le notifie
    const instance = this.currentStepComponentRef?.instance as InitializableComponent;
    if (this.entretienData && instance.initialize && typeof instance.initialize === 'function') {
      instance.initialize(this.entretienData);
    }
  }

  getAgent() {
    return this.getForm().get('personne') as FormGroup;
  }
  getSuperieur() {
    return this.getForm().get('superieur') as FormGroup;
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
