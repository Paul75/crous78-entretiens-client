import {
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
} from '@angular/forms';

import { NgbDatepickerModule } from '@ng-bootstrap/ng-bootstrap';
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
export class EntretienProComponent extends FormProvider implements OnChanges {
  id: string | undefined;
  entretien: Entretien | undefined;

  name = environment.application.name;
  angular = environment.application.angular;
  bootstrap = environment.application.bootstrap;
  fontawesome = environment.application.fontawesome;

  private router = inject(Router);

  typeForm = 'professionnel';

  entretienForm!: FormGroup;

  private createForm() {
    this.entretienForm = new FormBuilder().group({
      id: [DEFAULT_ENTRETIEN.id, [Validators.required]],
      type: [DEFAULT_ENTRETIEN.type, [Validators.required]],
      dateTransmission: [DEFAULT_ENTRETIEN.dateTransmission],
      statut: [DEFAULT_ENTRETIEN.statut],
      dateEntretien: [DEFAULT_ENTRETIEN.dateEntretien, [Validators.required]],
      personne: new FormBuilder().group({
        id: [DEFAULT_ENTRETIEN.personne.id, [Validators.required]],
        matricule: [DEFAULT_ENTRETIEN.personne.matricule],
        nomUsage: [DEFAULT_ENTRETIEN.personne.nomUsage],
        nom: [
          DEFAULT_ENTRETIEN.personne.nom,
          [Validators.required, Validators.minLength(2), Validators.maxLength(100)],
        ],
        prenom: [
          DEFAULT_ENTRETIEN.personne.prenom,
          [Validators.required, Validators.minLength(2), Validators.maxLength(100)],
        ],
        dateNaissance: [DEFAULT_ENTRETIEN.personne.dateNaissance, [Validators.required]],
        corpsGrade: [DEFAULT_ENTRETIEN.personne.corpsGrade, [Validators.required]],
        echelon: [DEFAULT_ENTRETIEN.personne.echelon, [Validators.required]],
        datePromotion: [DEFAULT_ENTRETIEN.personne.datePromotion],
        fonction: [DEFAULT_ENTRETIEN.personne.fonction],
        structure: [DEFAULT_ENTRETIEN.personne.structure],
        adresse: [DEFAULT_ENTRETIEN.personne.adresse],
      }),
      superieur: new FormBuilder().group({
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

      // 1 POSTE
      structure: [DEFAULT_ENTRETIEN.structure, [Validators.required]],
      intitulePoste: [DEFAULT_ENTRETIEN.intitulePoste, [Validators.required]],
      dateAffectation: [DEFAULT_ENTRETIEN.dateAffectation, [Validators.required]],
      emploiType: [DEFAULT_ENTRETIEN.emploiType, [Validators.required]],
      positionPoste: [DEFAULT_ENTRETIEN.positionPoste, [Validators.required]],
      quotiteAffectation: [DEFAULT_ENTRETIEN.quotiteAffectation, [Validators.required]],

      missions: [DEFAULT_ENTRETIEN.missions, [Validators.required]],

      conduiteProjet: [DEFAULT_ENTRETIEN.conduiteProjet, [Validators.required]],
      encadrement: [DEFAULT_ENTRETIEN.encadrement, [Validators.required]],
      cpeNbAgent: [DEFAULT_ENTRETIEN.cpeNbAgent, [Validators.required]],
      cpeCategA: [DEFAULT_ENTRETIEN.cpeCategA, [Validators.required]],
      cpeCategB: [DEFAULT_ENTRETIEN.cpeCategB, [Validators.required]],
      cpeCategC: [DEFAULT_ENTRETIEN.cpeCategC, [Validators.required]],

      // 2
      rappelObjectifs: [DEFAULT_ENTRETIEN.rappelObjectifs, [Validators.required]],
      evenementsSurvenus: [DEFAULT_ENTRETIEN.evenementsSurvenus, [Validators.required]],

      // 3
      // 3.1
      caCompetences: [DEFAULT_ENTRETIEN.caCompetences, [Validators.required]],
      caContribution: [DEFAULT_ENTRETIEN.caContribution, [Validators.required]],
      caCapacites: [DEFAULT_ENTRETIEN.caCapacites, [Validators.required]],
      caAptitude: [DEFAULT_ENTRETIEN.caAptitude, [Validators.required]],

      // 3.2
      agCompetences: [DEFAULT_ENTRETIEN.agCompetences, [Validators.required]],
      agContribution: [DEFAULT_ENTRETIEN.agContribution, [Validators.required]],
      agCapacites: [DEFAULT_ENTRETIEN.agCapacites, [Validators.required]],
      agAptitude: [DEFAULT_ENTRETIEN.agAptitude, [Validators.required]],

      realisationObjectifs: [DEFAULT_ENTRETIEN.realisationObjectifs, [Validators.required]],
      appreciationLitterale: [DEFAULT_ENTRETIEN.appreciationLitterale, [Validators.required]],

      // 4
      acquisExperiencePro: [DEFAULT_ENTRETIEN.acquisExperiencePro, [Validators.required]],

      // 5
      objectifsActivites: [DEFAULT_ENTRETIEN.objectifsActivites, [Validators.required]],
      demarcheEnvisagee: [DEFAULT_ENTRETIEN.demarcheEnvisagee, [Validators.required]],

      // 6

      evolutionActivites: [DEFAULT_ENTRETIEN.evolutionActivites, [Validators.required]],
      evolutionCarriere: [DEFAULT_ENTRETIEN.evolutionCarriere, [Validators.required]]
    });

    /*this.entretienForm.patchValue({
      dateEntretien: this.dateService.getCurrentDate()
    });*/
  }

  constructor(
    private cdref: ChangeDetectorRef,
    private entretienService: EntretienService,
    private dateService: DateService,
    private route: ActivatedRoute,
  ) {
    super();

    this.createForm();

    this.getEntretienById();
  }

  ngOnInit() {
    this.id = this.route.snapshot.params['id'];
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
        this.entretien = item;

        this.setForm(this.entretienForm, item);
        this.cdref.detectChanges();
      });
    }
  }

  getForm() {
    this.transformDatesToDisplay(this.entretienForm);
    return this.entretienForm;
  }
  setForm(form: FormGroup, entretien: Entretien) {
    form.patchValue(entretien);
  }

  ngOnChanges(changes: SimpleChanges) {
    this.cdref.detectChanges();
  }

  ngAfterContentChecked() {
    this.cdref.detectChanges();
  }

  getAgent() {
    return this.getForm().get('agent') as FormGroup;
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
    return this.getAgent()?.invalid || this.getSuperieur()?.invalid;
  }
  validStep2() {
    return this.getPoste()?.invalid;
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

    // also recommended
    this.entretienService.newEntretien(this.entretienForm.value).subscribe({
      next: (v: any) => {
        this.entretienForm.reset();
        this.createForm();

        this.router.navigate(['/forms/confirmation']);
      },
      error: e => console.error(e),
      complete: () => console.info('complete'),
    });
  }

  private transformDatesToDisplay(datas: FormGroup) {
    try {
      datas.patchValue({
        dateEntretien: this.dateService.formatDateOrEmpty(datas.get('dateEntretien')?.value),
        dateAffectation: this.dateService.formatDateOrEmpty(datas.get('dateAffectation')?.value),
        agent: {
          dateNaissance: this.dateService.formatDateOrEmpty(
            datas.get('agent.dateNaissance')?.value,
          ),
          datePromotion: this.dateService.formatDateOrEmpty(
            datas.get('agent.datePromotion')?.value,
          ),
        },
        superieur: {
          dateNaissance: this.dateService.formatDateOrEmpty(
            datas.get('superieur.dateNaissance')?.value,
          ),
          datePromotion: this.dateService.formatDateOrEmpty(
            datas.get('superieur.datePromotion')?.value,
          ),
        },
      });
    } catch (error) {}

    return datas;
  }
}
