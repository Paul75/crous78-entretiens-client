import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  inject,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import { CommonModule } from '@angular/common';

import {
  FormsModule,
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
  FormArray,
} from '@angular/forms';

import { NgbDatepickerModule, NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { StepperModule } from 'primeng/stepper';
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
import { ActivatedRoute, Router } from '@angular/router';
import { Entretien } from '@shared/models/entretien.model';
import { DEFAULT_ENTRETIEN } from '@shared/constants/entretien.constants';
import { EntretienService } from '@shared/services/entretiens/entretien.service';
import { DateService } from '@shared/services/date.service';
import { environment } from '@environments/environment';
import { StatutDemandeEnum } from '@shared/enums/statut.demande.enum';

@Component({
  selector: 'app-entretien-pro',
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgbDatepickerModule,
    ButtonModule,
    StepperModule,
    DrawerModule,
    EntretienProStep1Component,
    EntretienProStep2Component,
    EntretienProStep3Component,
    EntretienProStep4Component,
    EntretienProStep5Component,
    EntretienProStep6Component,
    EntretienProStep7Component,
    /*, RouterLink*/
  ],
  providers: [{ provide: FormProvider, useExisting: EntretienProComponent }],
  templateUrl: './entretien-pro.component.html',
  styleUrl: './entretien-pro.component.scss',
  changeDetection: ChangeDetectionStrategy.Default,
})
export class EntretienProComponent extends FormProvider implements OnChanges, AfterViewInit {
  // id: string | undefined;
  // entretien!: Entretien;

  name = environment.application.name;
  angular = environment.application.angular;
  bootstrap = environment.application.bootstrap;
  fontawesome = environment.application.fontawesome;

  private router = inject(Router);

  displayId = false;

  today = new Date();
  minDate: NgbDateStruct = {
    year: this.today.getFullYear(),
    month: this.today.getMonth() + 1, // Note: months are 1-indexed in NgbDateStruct
    day: this.today.getDate(),
  };

  typeForm = 'professionnel';

  entretienForm: FormGroup = new FormBuilder().group({
    id: [DEFAULT_ENTRETIEN.id, [Validators.required]],
    type: [DEFAULT_ENTRETIEN.type, [Validators.required]],
    statut: [DEFAULT_ENTRETIEN.statut],
    dateEntretien: [DEFAULT_ENTRETIEN.dateEntretien, [Validators.required]],

    // Etape 1 (step1)
    personne: new FormBuilder().group({
      id: [DEFAULT_ENTRETIEN.personne.id],
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

    superieur: new FormBuilder().group({
      id: [DEFAULT_ENTRETIEN.superieur.id],
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

    /**
     * FORMULAIRE ENTRETIEN PROFESSIONNEL
     */

    // Etape 2 (step2)
    // 1 POSTE
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

    // Etape 3 (step3)
    rappelObjectifs: [DEFAULT_ENTRETIEN.rappelObjectifs],
    evenementsSurvenus: [DEFAULT_ENTRETIEN.evenementsSurvenus],

    // Etape 4 (step4)
    // 3
    // 3.1
    caCompetences: [DEFAULT_ENTRETIEN.caCompetences],
    caContribution: [DEFAULT_ENTRETIEN.caContribution],
    caCapacites: [DEFAULT_ENTRETIEN.caCapacites],
    caAptitude: [DEFAULT_ENTRETIEN.caAptitude],

    // 3.2
    agCompetences: [DEFAULT_ENTRETIEN.agCompetences],
    agContribution: [DEFAULT_ENTRETIEN.agContribution],
    agCapacites: [DEFAULT_ENTRETIEN.agCapacites],
    agAptitude: [DEFAULT_ENTRETIEN.agAptitude],

    realisationObjectifs: [DEFAULT_ENTRETIEN.realisationObjectifs],
    appreciationLitterale: [DEFAULT_ENTRETIEN.appreciationLitterale],

    // Etape 5 (step5)
    acquisExperiencePro: [DEFAULT_ENTRETIEN.acquisExperiencePro],

    // Etape 6 (step6)
    objectifsActivites: [DEFAULT_ENTRETIEN.objectifsActivites],
    demarcheEnvisagee: [DEFAULT_ENTRETIEN.demarcheEnvisagee],

    // Etape 7 (step7)
    evolutionActivites: [DEFAULT_ENTRETIEN.evolutionActivites],
    evolutionCarriere: [DEFAULT_ENTRETIEN.evolutionCarriere],
  });

  constructor(
    private cdref: ChangeDetectorRef,
    private entretienService: EntretienService,
    private dateService: DateService,
    private route: ActivatedRoute,
  ) {
    super();

    // this.initialize_formationsDispensees();
  }

  ngAfterViewInit(): void {
    this.getEntretienById();
  }

  ngOnInit() {}

  ngOnChanges(changes: SimpleChanges) {
    this.cdref.detectChanges();
  }

  ngAfterContentChecked() {
    this.cdref.detectChanges();
  }

  getEntretienById() {
    // console.log('getEntretienById');
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
        // 1. Patch initial du formulaire parent
        this.setForm(item);

        // 2. Envoi des données AUX SOUS-FORMULAIRES via le service
        // this.dataService.updateEntretien(item);

        this.cdref.detectChanges();
      });
    }
  }

  getForm(): FormGroup {
    // console.log(this.entretienForm.value);
    return this.entretienForm;
  }

  setForm(entretien: Entretien) {
    this.entretienForm.patchValue(entretien);
    this.transformDatesToDisplay();
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

  validStep1() {
    return this.getAgent().invalid && this.getSuperieur().invalid;
  }
  validStep2() {
    return this.getPoste().invalid;
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
  validStep5() {
    return this.getAcquisExperiencePro()?.invalid;
  }
  validStep6() {
    return this.getObjectifsFixes()?.invalid;
  }

  onSubmit() {
    // console.log(this.entretienForm);
    if (this.entretienForm.invalid) {
      this.entretienForm.markAllAsTouched();
      return;
    }

    this.entretienForm.value.dateEntretien = this.dateService.transformDateEn(
      this.entretienForm.value.dateEntretien,
    );
    this.entretienForm.value.dateAffectation = this.dateService.transformDateEn(
      this.entretienForm.value.dateAffectation,
    );

    // console.log('Your form data:', this.entretienForm.value);

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
