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
import { environment } from '@environments/environment';
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
import { StatutDemandeEnum } from '@shared/enums/statut.demande.enum';
import { DatePickerModule } from 'primeng/datepicker';
import { EntretienFormProvider } from '@forms/providers/entretien-form.provider';
import { transformDatesToDisplay } from '@shared/utils/dates.utils';
import { FormulaireService } from '@forms/services/formulaire.service';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { ButtonGroupModule } from 'primeng/buttongroup';

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
    EntretienFormStep1Component,
    EntretienFormStep2Component,
    EntretienFormStep3Component,
    EntretienFormStep4Component,
    EntretienFormStep5Component,
    EntretienFormStep6Component,
    EntretienFormStep7Component,
    EntretienFormStep8Component,
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
  name = environment.application.name;
  angular = environment.application.angular;
  bootstrap = environment.application.bootstrap;
  fontawesome = environment.application.fontawesome;

  today = new Date();
  minDate: Date = new Date(this.today.getFullYear(), this.today.getMonth(), this.today.getDate());

  typeForm = 'formation';

  private entretienData?: Entretien;

  // Utilisez ViewChildren au lieu de ViewChild
  @ViewChildren(EntretienFormStep1Component)
  step1ChildComponents!: QueryList<EntretienFormStep1Component>;

  @ViewChildren(EntretienFormStep2Component)
  step2ChildComponents!: QueryList<EntretienFormStep2Component>;

  @ViewChildren(EntretienFormStep3Component)
  step3ChildComponents!: QueryList<EntretienFormStep3Component>;

  @ViewChildren(EntretienFormStep4Component)
  step4ChildComponents!: QueryList<EntretienFormStep4Component>;

  @ViewChildren(EntretienFormStep5Component)
  step5ChildComponents!: QueryList<EntretienFormStep5Component>;

  @ViewChildren(EntretienFormStep6Component)
  step6ChildComponents!: QueryList<EntretienFormStep6Component>;

  @ViewChildren(EntretienFormStep7Component)
  step7ChildComponents!: QueryList<EntretienFormStep7Component>;

  entretienForm!: FormGroup;

  stepsCount = 0;
  currentStepIndex: number = 1;
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
    this.cdref.detectChanges();

    // Liste des composants enfants et leurs méthodes d'initialisation
    const childComponents = [
      {
        components: this.step2ChildComponents,
        initMethod: (child: any) => this.initializeStep2ChildForm(child),
      },
      {
        components: this.step3ChildComponents,
        initMethod: (child: any) => this.initializeStep3ChildForm(child),
      },
      {
        components: this.step4ChildComponents,
        initMethod: (child: any) => this.initializeStep4ChildForm(child),
      },
      {
        components: this.step5ChildComponents,
        initMethod: (child: any) => this.initializeStep5ChildForm(child),
      },
    ];

    // Souscrire aux changements pour chaque composant enfant
    childComponents.forEach(({ components, initMethod }) => {
      components.changes.subscribe(() => {
        if (components.length > 0 && this.entretienData) {
          initMethod(components.first);
        }
      });
    });
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
    this.entretienData = entretien;
    this.entretienForm.patchValue(entretien);
    transformDatesToDisplay(this.entretienForm);

    // Initialiser immédiatement si l'enfant est déjà disponible
    const childComponents = [
      {
        components: this.step2ChildComponents,
        initMethod: (child: any) => this.initializeStep2ChildForm(child),
      },
      {
        components: this.step3ChildComponents,
        initMethod: (child: any) => this.initializeStep3ChildForm(child),
      },
      {
        components: this.step4ChildComponents,
        initMethod: (child: any) => this.initializeStep4ChildForm(child),
      },
      {
        components: this.step5ChildComponents,
        initMethod: (child: any) => this.initializeStep5ChildForm(child),
      },
    ];

    childComponents.forEach(({ components, initMethod }) => {
      if (components.length > 0) {
        initMethod(components.first);
      }
    });
  }

  /**
   *
   * @param child
   */
  private initializeStep2ChildForm(child: EntretienFormStep2Component) {
    child.initializeFormWithData(this.entretienData!.formationsDispensees);
  }
  private initializeStep3ChildForm(child: EntretienFormStep3Component) {
    child.initializeFormWithData(this.entretienData!.formationsRealisees);
  }
  private initializeStep4ChildForm(child: EntretienFormStep4Component) {
    child.initializeFormWithData(this.entretienData!.formationsDemandees);
  }
  private initializeStep5ChildForm(child: EntretienFormStep5Component) {
    child.initializeFormContinueWithData(this.entretienData!.formationsContinue);
    child.initializeActionFormDemandeesWithData(this.entretienData!.actionsFormationsDemandees);
  }

  getAgent() {
    return this.getForm().get('personne') as FormGroup;
  }
  getSuperieur() {
    return this.getForm().get('superieur') as FormGroup;
  }

  async saveCurrentStep() {
    switch (this.currentStepIndex) {
      case 1:
        // this.step1ChildComponents.first.saveDatas();
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

  /*onSubmit() {
    if (this.entretienForm.invalid) {
      this.entretienForm.markAllAsTouched();
      this.fromNextStep = false;
      return;
    }

    transformDatesToBdd(this.entretienForm);

    if (!this.fromNextStep) {
      const statutsExclus = [StatutDemandeEnum.PREPARE, StatutDemandeEnum.RDV];

      const statut = this.entretienForm.value.statut;
      if (!statutsExclus.includes(statut)) {
        this.entretienForm.value.statut = StatutDemandeEnum.AGENTSIGN;
      }
    }

    if (this.entretienForm.value.formationsDispensees?.length === 0) {
      delete this.entretienForm.value.formationsDispensees;
    }
    if (this.entretienForm.value.formationsRealisees?.length === 0) {
      delete this.entretienForm.value.formationsRealisees;
    }
    if (this.entretienForm.value.formationsDemandees?.length === 0) {
      delete this.entretienForm.value.formationsDemandees;
    }
    if (this.entretienForm.value.formationsContinue?.length === 0) {
      delete this.entretienForm.value.formationsContinue;
    }
    if (this.entretienForm.value.actionsFormationsDemandees?.length === 0) {
      delete this.entretienForm.value.actionsFormationsDemandees;
    }

    this.entretienService
      .updateEntretien(this.entretienForm.value.id, this.entretienForm.value)
      .subscribe({
        next: (v: any) => {
          if (!this.fromNextStep) {
            this.messageService.add({
              severity: 'success',
              summary: 'Succès',
              detail: 'Formulaire enregistré avec succès !',
            });
          }

          transformDatesToDisplay(this.entretienForm);
          this.fromNextStep = false;
        },
        error: e => console.error(e),
      });
  }*/

  get boutonLabelSubmit(): string {
    const statut = this.entretienForm.value.statut;
    const statutsEnregistrer = [StatutDemandeEnum.PREPARE, StatutDemandeEnum.RDV];
    return statutsEnregistrer.includes(statut) ? 'ENREGISTRER' : 'VALIDER';
  }
}
