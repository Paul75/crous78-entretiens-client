import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnChanges,
  SimpleChanges,
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

  entretienForm: FormGroup = new FormBuilder().group({
    id: [DEFAULT_ENTRETIEN.id, [Validators.required]],
    type: [DEFAULT_ENTRETIEN.type, [Validators.required]],
    statut: [DEFAULT_ENTRETIEN.statut],
    dateEntretien: [DEFAULT_ENTRETIEN.dateEntretien, [Validators.required]],
    personne: new FormBuilder().group({
      id: [DEFAULT_ENTRETIEN.personne.id, [Validators.required]],
      nomUsage: [DEFAULT_ENTRETIEN.personne.nomUsage],
      nom: [DEFAULT_ENTRETIEN.personne.nom, [Validators.minLength(2), Validators.maxLength(100)]],
      prenom: [
        DEFAULT_ENTRETIEN.personne.prenom,
        [Validators.minLength(2), Validators.maxLength(100)],
      ],
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

    // 2
    competenceTransferFormateur: [DEFAULT_ENTRETIEN.competenceTransferFormateur],
    competenceTransferTuteur: [DEFAULT_ENTRETIEN.competenceTransferTuteur],
    competenceTransferPresident: [DEFAULT_ENTRETIEN.competenceTransferPresident],
    competenceTransferMembre: [DEFAULT_ENTRETIEN.competenceTransferMembre],
  });

  constructor(
    private cdref: ChangeDetectorRef,
    private entretienService: EntretienService,
    private dateService: DateService,
    private route: ActivatedRoute,
  ) {
    super();
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
    console.log('getEntretienById');
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

    console.log(this.entretienForm.value);
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
