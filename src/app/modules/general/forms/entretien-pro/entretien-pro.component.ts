import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
} from '@angular/core';
import { CommonModule } from '@angular/common';

import {
  FormsModule,
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';

import { environment } from '../../../../../environments/environment';
import { NgbDatepickerModule } from '@ng-bootstrap/ng-bootstrap';
import { AppreciationGeneraleEnum } from '../enums/appreciation_generale.enum';
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
import { EntretienService } from '../services/entretien.service';
import { transformDateEn } from '../../../../shared/utils/date-utils';
import { ActivatedRoute } from '@angular/router';

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
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EntretienProComponent extends FormProvider {
  id: string | undefined;

  appreciationGenerale: typeof AppreciationGeneraleEnum =
    AppreciationGeneraleEnum;

  name = environment.application.name;
  angular = environment.application.angular;
  bootstrap = environment.application.bootstrap;
  fontawesome = environment.application.fontawesome;

  typeForm = 'professionnel';

  menuEntretien = [
    "Informations générales",
    "1 - DESCRIPTION DU POSTE OCCUPE PAR L'AGENT",
    "2 - Evaluation de l'année écoulée",
    "3 - VALEUR PROFESSIONNELLE ET MANIERE DE SERVIR DU FONCTIONNAIRE",
    "4 - ACQUIS DE L’EXPERIENCE PROFESSIONNELLE",
    "5 - OBJECTIFS FIXÉS POUR LA NOUVELLE ANNÉE",
    "6 - PERSPECTIVES D'EVOLUTION PROFESSIONNELLE",
  ]

  valueDefault = 'TEST....';
  valueDefaultDate = '01/01/2025';
  valueDefaultNumber = 10;
  valueDefaultBool = true;
  valueDefaultAppreciationGenerale = 'A Acquérir';

  valueDefaultNumberAgent = 1;

  entretienForm!: FormGroup;

  private createForm() {
    this.entretienForm = new FormBuilder().group({
      type: [this.typeForm, [Validators.required]],
      dateEntretien: [this.valueDefaultDate, [Validators.required]],
      agent: new FormBuilder().group({
        id: [this.valueDefaultNumberAgent, [Validators.required]],
        nomUsage: [
          this.valueDefault,
          [
            Validators.required,
            Validators.minLength(2),
            Validators.maxLength(100),
          ],
        ],
        nom: [
          this.valueDefault,
          [
            Validators.required,
            Validators.minLength(2),
            Validators.maxLength(100),
          ],
        ],
        prenom: [
          this.valueDefault,
          [
            Validators.required,
            Validators.minLength(2),
            Validators.maxLength(100),
          ],
        ],
        dateNaissance: [this.valueDefaultDate, [Validators.required]],
        corpsGrade: [this.valueDefault, [Validators.required]],
        echelon: [this.valueDefault, [Validators.required]],
        datePromotion: [this.valueDefaultDate, [Validators.required]],
      }),
      superieur: new FormBuilder().group({
        id: [this.valueDefaultNumberAgent, [Validators.required]],
        nom: [
          this.valueDefault,
          [Validators.required, Validators.maxLength(100)],
        ],
        prenom: [
          this.valueDefault,
          [Validators.required, Validators.maxLength(100)],
        ],
        corpsGrade: [this.valueDefault, [Validators.required]],
        fonction: [
          this.valueDefault,
          [Validators.required, Validators.maxLength(100)],
        ],
        structure: [
          this.valueDefault,
          [Validators.required, Validators.maxLength(100)],
        ],
        adresse: [this.valueDefault, [Validators.required]],
      }),

      // 1 POSTE
      structure: [this.valueDefault, [Validators.required]],
      intitulePoste: [this.valueDefault, [Validators.required]],
      dateAffectation: [this.valueDefaultDate, [Validators.required]],
      emploiType: [this.valueDefault, [Validators.required]],
      positionPoste: [this.valueDefault, [Validators.required]],
      quotiteAffectation: [this.valueDefault, [Validators.required]],

      missions: [this.valueDefault, [Validators.required]],

      conduiteProjet: [this.valueDefaultBool, [Validators.required]],
      encadrement: [this.valueDefaultBool, [Validators.required]],
      cpeNbAgent: [this.valueDefaultNumber, [Validators.required]],
      cpeCategA: [this.valueDefaultNumber, [Validators.required]],
      cpeCategB: [this.valueDefaultNumber, [Validators.required]],
      cpeCategC: [this.valueDefaultNumber, [Validators.required]],

      // 2
      rappelObjectifs: [this.valueDefault, [Validators.required]],
      evenementsSurvenus: [this.valueDefault, [Validators.required]],

      // 3
      // 3.1
      caCompetences: [this.valueDefault, [Validators.required]],
      caContribution: [this.valueDefault, [Validators.required]],
      caCapacites: [this.valueDefault, [Validators.required]],
      caAptitude: [this.valueDefault, [Validators.required]],

      // 3.2
      agCompetences: [
        this.valueDefaultAppreciationGenerale,
        [Validators.required],
      ],
      agContribution: [
        this.valueDefaultAppreciationGenerale,
        [Validators.required],
      ],
      agCapacites: [
        this.valueDefaultAppreciationGenerale,
        [Validators.required],
      ],
      agAptitude: [
        this.valueDefaultAppreciationGenerale,
        [Validators.required],
      ],

      realisationObjectifs: [this.valueDefault, [Validators.required]],
      appreciationLitterale: [this.valueDefault, [Validators.required]],

      // 4
      acquisExperiencePro: [this.valueDefault, [Validators.required]],

      // 5
      objectifsActivites: [this.valueDefault, [Validators.required]],
      demarcheEnvisagee: [this.valueDefault, [Validators.required]],

      // 6

      evolutionActivites: [this.valueDefault, [Validators.required]],
      evolutionCarriere: [this.valueDefault, [Validators.required]],
    });
  }

  constructor(
    private cdref: ChangeDetectorRef,
    private entretienService: EntretienService,
    private route: ActivatedRoute
  ) {
    super();
    this.createForm();
  }

  ngOnInit() {
    this.id = this.route.snapshot.params['id'];
  }

  getForm() {
    return this.entretienForm;
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
    const evenementsSurvenus = this.getForm().get(
      'evenementsSurvenus'
    ) as FormGroup;
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

    const realisationObjectifs = this.getForm().get(
      'realisationObjectifs'
    ) as FormGroup;
    const appreciationLitterale = this.getForm().get(
      'appreciationLitterale'
    ) as FormGroup;
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
    console.log(this.entretienForm);
    if (this.entretienForm.invalid) {
      this.entretienForm.markAllAsTouched();
      return;
    }

    this.entretienForm.value.dateEntretien = transformDateEn(
      this.entretienForm.value.dateEntretien
    );
    this.entretienForm.value.dateAffectation = transformDateEn(
      this.entretienForm.value.dateAffectation
    );

    console.log('Your form data:', this.entretienForm.value);

    // also recommended
    this.entretienService.newEntretien(this.entretienForm.value).subscribe({
      next: (v) => {
        console.log(v);
        this.entretienForm.reset();
        this.createForm();
      },
      error: (e) => console.error(e),
      complete: () => console.info('complete'),
    });
  }
}
