import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnChanges,
  QueryList,
  SimpleChanges,
  ViewChildren,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { environment } from '@environments/environment';
import { NgbDatepickerModule, NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { DEFAULT_ENTRETIEN } from '@shared/constants/entretien.constants';
import { EntretienService } from '@shared/services/entretiens/entretien.service';
import { DateService } from '@shared/services/date.service';
import { ActivatedRoute } from '@angular/router';
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

@Component({
  selector: 'app-entretien-formation',
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgbDatepickerModule,
    ButtonModule,
    StepperModule,
    DrawerModule,
    EntretienFormStep1Component,
    EntretienFormStep2Component,
    EntretienFormStep3Component,
    EntretienFormStep4Component,
    EntretienFormStep5Component,
    EntretienFormStep6Component,
    EntretienFormStep7Component,
  ],
  providers: [{ provide: FormProvider, useExisting: EntretienFormationComponent }],
  templateUrl: './entretien-formation.component.html',
  styleUrl: './entretien-formation.component.scss',
  changeDetection: ChangeDetectionStrategy.Default,
})
export class EntretienFormationComponent extends FormProvider implements OnChanges, AfterViewInit {
  name = environment.application.name;
  angular = environment.application.angular;
  bootstrap = environment.application.bootstrap;
  fontawesome = environment.application.fontawesome;

  today = new Date();
  minDate: NgbDateStruct = {
    year: this.today.getFullYear(),
    month: this.today.getMonth() + 1, // Note: months are 1-indexed in NgbDateStruct
    day: this.today.getDate(),
  };

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

  entretienForm: FormGroup = new FormBuilder().group({
    id: [DEFAULT_ENTRETIEN.id, [Validators.required]],
    type: [DEFAULT_ENTRETIEN.type, [Validators.required]],
    statut: [DEFAULT_ENTRETIEN.statut],
    dateEntretien: [DEFAULT_ENTRETIEN.dateEntretien, [Validators.required]],

    // Etape 1 (step1)

    personne: new FormBuilder().group({
      id: [DEFAULT_ENTRETIEN.personne.id, [Validators.required]],
      nomUsage: [DEFAULT_ENTRETIEN.personne.nomUsage],
      nom: [DEFAULT_ENTRETIEN.personne.nom],
      prenom: [DEFAULT_ENTRETIEN.personne.prenom],
      dateNaissance: [DEFAULT_ENTRETIEN.personne.dateNaissance],
      corpsGrade: [DEFAULT_ENTRETIEN.personne.corpsGrade],
    }),
    superieur: new FormBuilder().group({
      id: [DEFAULT_ENTRETIEN.superieur.id],
      nom: [DEFAULT_ENTRETIEN.superieur.nom],
      prenom: [DEFAULT_ENTRETIEN.superieur.prenom],
      corpsGrade: [DEFAULT_ENTRETIEN.superieur.corpsGrade],
      fonction: [DEFAULT_ENTRETIEN.superieur.fonction],
      structure: [DEFAULT_ENTRETIEN.superieur.structure],
      adresse: [DEFAULT_ENTRETIEN.superieur.adresse],
    }),

    //
    dateEntretienPrecedent: [DEFAULT_ENTRETIEN.dateEntretienPrecedent],
    soldeCPF: [DEFAULT_ENTRETIEN.soldeCPF],
    utiliserCPF: [DEFAULT_ENTRETIEN.utiliserCPF],

    // Etape 2 (step2)
    structure: [DEFAULT_ENTRETIEN.structure],
    intitulePoste: [DEFAULT_ENTRETIEN.intitulePoste],
    dateAffectation: [DEFAULT_ENTRETIEN.dateAffectation],
    emploiType: [DEFAULT_ENTRETIEN.emploiType],
    positionPoste: [DEFAULT_ENTRETIEN.positionPoste],
    quotiteAffectation: [DEFAULT_ENTRETIEN.quotiteAffectation],

    missions: [DEFAULT_ENTRETIEN.missions],

    conduiteProjet: [DEFAULT_ENTRETIEN.conduiteProjet],
    encadrement: [DEFAULT_ENTRETIEN.encadrement],
    cpeNbAgent: [DEFAULT_ENTRETIEN.cpeNbAgent],
    cpeCategA: [DEFAULT_ENTRETIEN.cpeCategA],
    cpeCategB: [DEFAULT_ENTRETIEN.cpeCategB],
    cpeCategC: [DEFAULT_ENTRETIEN.cpeCategC],

    competenceTransferFormateur: [DEFAULT_ENTRETIEN.competenceTransferFormateur],
    competenceTransferTuteur: [DEFAULT_ENTRETIEN.competenceTransferTuteur],
    competenceTransferPresident: [DEFAULT_ENTRETIEN.competenceTransferPresident],
    competenceTransferMembre: [DEFAULT_ENTRETIEN.competenceTransferMembre],

    formationsDispensees: new FormBuilder().array([]),

    // Etape 3 (step3)

    formationsRealisees: new FormBuilder().array([]),

    // Etape 4 (step4)
    formationsDemandees: new FormBuilder().array([]),

    // Etape 5 (step5)
    formationsContinue: new FormBuilder().array([]),
    actionsFormationsDemandees: new FormBuilder().array([]),

    // Etape 6 (step6)
    formationsPreparationConcours: [DEFAULT_ENTRETIEN.formationsPreparationConcours],

    // Etape 7 (step7)
    formationsConstruireProjet: [DEFAULT_ENTRETIEN.formationsConstruireProjet],
  });

  /**
   *  CODE GENERAL
   */

  constructor(
    private cdref: ChangeDetectorRef,
    private fb: FormBuilder,
    private entretienService: EntretienService,
    private dateService: DateService,
    private route: ActivatedRoute,
  ) {
    super();

    //this.initialize_formationsDispensees();
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
    this.transformDatesToDisplay();

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

    if (this.entretienForm.value.statut != StatutDemandeEnum.PREPARE) {
      this.entretienForm.value.statut = StatutDemandeEnum.AGENTSIGN;
    }

    console.log(this.entretienForm.value);
  }

  get boutonLabelSubmit(): string {
    return this.entretienForm.value.statut === StatutDemandeEnum.PREPARE
      ? 'ENREGISTRER'
      : 'VALIDER';
  }

  private transformDatesToDisplay(): void {
    try {
      this.entretienForm.patchValue({
        dateEntretien: this.dateService.formatDateOrEmpty(
          this.entretienForm.get('dateEntretien')?.value,
        ),
        dateAffectation: this.dateService.formatDateOrEmpty(
          this.entretienForm.get('dateAffectation')?.value,
        ),
        personne: {
          dateNaissance: this.dateService.formatDateOrEmpty(
            this.entretienForm.get('personne.dateNaissance')?.value,
          ),
          datePromotion: this.dateService.formatDateOrEmpty(
            this.entretienForm.get('personne.datePromotion')?.value,
          ),
        },
        superieur: {
          dateNaissance: this.dateService.formatDateOrEmpty(
            this.entretienForm.get('superieur.dateNaissance')?.value,
          ),
          datePromotion: this.dateService.formatDateOrEmpty(
            this.entretienForm.get('superieur.datePromotion')?.value,
          ),
        },
      });
    } catch (error) {}
  }
}
