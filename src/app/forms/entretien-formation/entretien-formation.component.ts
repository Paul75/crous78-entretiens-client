import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  inject,
  OnChanges,
  QueryList,
  SimpleChanges,
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
import { StepperModule } from 'primeng/stepper';
import { EntretienFormStep1Component } from './step1/step1.component';
import { EntretienFormStep2Component } from './step2/step2.component';
import { EntretienFormStep3Component } from './step3/step3.component';
import { EntretienFormStep4Component } from './step4/step4.component';
import { EntretienFormStep5Component } from './step5/step5.component';
import { EntretienFormStep6Component } from './step6/step6.component';
import { EntretienFormStep7Component } from './step7/step7.component';
import { StatutDemandeEnum } from '@shared/enums/statut.demande.enum';
import { DatePickerModule } from 'primeng/datepicker';
import { EntretienFormProvider } from '@forms/providers/entretien-form.provider';
import { transformDatesToBdd, transformDatesToDisplay } from '@shared/utils/dates.utils';

@Component({
  selector: 'app-entretien-formation',
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    ButtonModule,
    StepperModule,
    DatePickerModule,
    DrawerModule,
    EntretienFormStep1Component,
    EntretienFormStep2Component,
    EntretienFormStep3Component,
    EntretienFormStep4Component,
    EntretienFormStep5Component,
    EntretienFormStep6Component,
    EntretienFormStep7Component,
  ],
  providers: [
    EntretienFormProvider,
    { provide: FormProvider, useExisting: EntretienFormationComponent },
  ],
  templateUrl: './entretien-formation.component.html',
  styleUrl: './entretien-formation.component.scss',
  changeDetection: ChangeDetectionStrategy.Default,
})
export class EntretienFormationComponent extends FormProvider implements OnChanges, AfterViewInit {
  name = environment.application.name;
  angular = environment.application.angular;
  bootstrap = environment.application.bootstrap;
  fontawesome = environment.application.fontawesome;

  private router = inject(Router);

  today = new Date();
  minDate: Date = new Date(this.today.getFullYear(), this.today.getMonth(), this.today.getDate());

  typeForm = 'formation';

  private entretienData?: Entretien;

  // Utilisez ViewChildren au lieu de ViewChild
  @ViewChildren(EntretienFormStep2Component)
  step2ChildComponents!: QueryList<EntretienFormStep2Component>;

  @ViewChildren(EntretienFormStep3Component)
  step3ChildComponents!: QueryList<EntretienFormStep3Component>;

  @ViewChildren(EntretienFormStep4Component)
  step4ChildComponents!: QueryList<EntretienFormStep4Component>;

  @ViewChildren(EntretienFormStep5Component)
  step5ChildComponents!: QueryList<EntretienFormStep5Component>;

  entretienForm!: FormGroup;
  /**
   *  CODE GENERAL
   */

  constructor(
    private cdref: ChangeDetectorRef,
    private entretienService: EntretienService,
    private formProvider: EntretienFormProvider,
    private route: ActivatedRoute,
  ) {
    super();

    this.entretienForm = this.formProvider.getForm();
  }

  ngAfterViewInit(): void {
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

  ngOnInit() {}

  ngOnChanges(changes: SimpleChanges) {
    this.cdref.detectChanges();
  }

  ngAfterContentChecked() {
    this.cdref.detectChanges();
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
   * @param activateCallback
   */

  handleStep2Next(activateCallback: (step: number) => void): void {
    this.step2ChildComponents.first.saveData();
    activateCallback(3);
  }

  handleStep3Next(activateCallback: (step: number) => void): void {
    this.step3ChildComponents.first.saveData();
    activateCallback(4);
  }

  handleStep4Next(activateCallback: (step: number) => void): void {
    this.step4ChildComponents.first.saveData();
    activateCallback(5);
  }

  handleStep5Next(activateCallback: (step: number) => void): void {
    this.step5ChildComponents.first.saveData();
    activateCallback(6);
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

  validStep1() {
    return this.getAgent()?.invalid || this.getSuperieur()?.invalid;
  }
  validStep2() {
    return false;
  }
  validStep3() {
    const rappelObjectifs = this.getForm().get('rappelObjectifs') as FormGroup;
    const evenementsSurvenus = this.getForm().get('evenementsSurvenus') as FormGroup;
    return rappelObjectifs?.invalid || evenementsSurvenus?.invalid;
  }
  validStep4() {
    const caCompetences = this.getForm().get('caCompetences') as FormGroup;
    const caContribution = this.getForm().get('caContribution') as FormGroup;
    const caCapacites = this.getForm().get('caCapacites') as FormGroup;
    const caAptitude = this.getForm().get('caAptitude') as FormGroup;

    // 3.2
    const agCompetences = this.getForm().get('agCompetences') as FormGroup;
    const agContribution = this.getForm().get('agContribution') as FormGroup;
    const agCapacites = this.getForm().get('agCapacites') as FormGroup;
    const agAptitude = this.getForm().get('agAptitude') as FormGroup;

    const realisationObjectifs = this.getForm().get('realisationObjectifs') as FormGroup;
    const appreciationLitterale = this.getForm().get('appreciationLitterale') as FormGroup;
    return (
      caCompetences?.invalid ||
      caContribution?.invalid ||
      caCapacites?.invalid ||
      caAptitude?.invalid ||
      agCompetences?.invalid ||
      agContribution?.invalid ||
      agCapacites?.invalid ||
      agAptitude?.invalid ||
      realisationObjectifs?.invalid ||
      appreciationLitterale?.invalid
    );
  }

  validStep5(): boolean {
    return false;
  }

  validStep6(): boolean {
    return false;
  }

  validStep7(): boolean {
    return false;
  }

  onSubmit() {
    if (this.entretienForm.invalid) {
      this.entretienForm.markAllAsTouched();
      return;
    }

    transformDatesToBdd(this.entretienForm);

    const statutsExclus = [StatutDemandeEnum.PREPARE, StatutDemandeEnum.RDV];

    const statut = this.entretienForm.value.statut;
    if (!statutsExclus.includes(statut)) {
      this.entretienForm.value.statut = StatutDemandeEnum.AGENTSIGN;
    }

    this.entretienService
      .updateEntretien(this.entretienForm.value.id, this.entretienForm.value)
      .subscribe({
        next: (v: any) => {
          this.router.navigate(['/forms/confirmation']);
        },
        error: e => console.error(e),
        complete: () => console.info('complete'),
      });
  }

  get boutonLabelSubmit(): string {
    const statut = this.entretienForm.value.statut;
    const statutsEnregistrer = [StatutDemandeEnum.PREPARE, StatutDemandeEnum.RDV];
    return statutsEnregistrer.includes(statut) ? 'ENREGISTRER' : 'VALIDER';
  }
}
