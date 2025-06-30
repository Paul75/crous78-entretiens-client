import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  inject,
  OnChanges,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import { CommonModule } from '@angular/common';

import { FormsModule, ReactiveFormsModule, FormGroup } from '@angular/forms';

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
import { EntretienService } from '@shared/services/entretiens/entretien.service';
import { environment } from '@environments/environment';
import { StatutDemandeEnum } from '@shared/enums/statut.demande.enum';
import { DatePickerModule } from 'primeng/datepicker';
import { EntretienProProvider } from '@forms/providers/entretien-pro.provider';
import { transformDatesToBdd, transformDatesToDisplay } from '@shared/utils/dates.utils';
import { FormulaireService } from '@forms/services/formulaire.service';

@Component({
  selector: 'app-entretien-pro',
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    ButtonModule,
    StepperModule,
    DatePickerModule,
    DrawerModule,
    EntretienProStep1Component,
    EntretienProStep2Component,
    EntretienProStep3Component,
    EntretienProStep4Component,
    EntretienProStep5Component,
    EntretienProStep6Component,
    EntretienProStep7Component,
  ],
  providers: [EntretienProProvider, { provide: FormProvider, useExisting: EntretienProComponent }],
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

  private router = inject(Router);

  displayId = false;

  today = new Date();
  minDate: Date = new Date(this.today.getFullYear(), this.today.getMonth(), this.today.getDate());

  typeForm = 'professionnel';

  entretienForm!: FormGroup;

  constructor(
    private cdref: ChangeDetectorRef,
    private formulaireService: FormulaireService,
    private formProvider: EntretienProProvider,
    private entretienService: EntretienService,
    private route: ActivatedRoute,
  ) {
    super();
    this.entretienForm = this.formProvider.getForm();
  }

  ngOnInit() {
    this.formulaireService.reset();
  }

  ngAfterViewInit(): void {
    this.getEntretienById();
  }

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
