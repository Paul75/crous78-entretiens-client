import {
  Component,
  EventEmitter,
  inject,
  Input,
  OnDestroy,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { CommonModule, formatDate } from '@angular/common';
import { Entretien } from '@shared/models/entretien.model';

import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { ButtonGroupModule } from 'primeng/buttongroup';
import { TypeEntretien } from '@shared/enums/type-entretien.enum';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Popover, PopoverModule } from 'primeng/popover';
import { DatePickerModule } from 'primeng/datepicker';
import { StatutDemandeEnum } from '@shared/enums/statut.demande.enum';
import { EntretienService } from '@shared/services/entretiens/entretien.service';
import { SignatureComponent } from '@shared/components/dialogs/signature/signature.component';
import { TypesSignatureEnum } from '@shared/enums/types.signature.enum';
import { CommunicationSignatureService } from '@shared/services/communications/communication-signature.service';
import { CommunicationEmailsService } from '@shared/services/communications/communication-emails.service';
import { finalize, Subject, takeUntil } from 'rxjs';
import { MessageService } from 'primeng/api';
import { AnneeScolaire } from '@shared/utils/annee-scolaire.util';
import { TooltipModule } from 'primeng/tooltip';

@Component({
  selector: 'app-admin-liste-entretiens-buttons2',
  imports: [
    CommonModule,
    TableModule,
    ButtonModule,
    ButtonGroupModule,
    DatePickerModule,
    TooltipModule,
    PopoverModule,
    FormsModule,
    SignatureComponent,
  ],
  providers: [],
  templateUrl: './buttons.component.html',
  styleUrl: './buttons.component.scss',
})
export class AdminListeEntretiensButtonsComponent implements OnInit, OnDestroy {
  @Input()
  entretien!: Entretien;

  @Output() getPdf = new EventEmitter<number>();
  @Output() viewPdf = new EventEmitter<number>();

  anneeScolaire = AnneeScolaire.getAnneeScolaireActuelle();

  minDate = this.anneeScolaire.getDateDebut(); // 1er septembre
  maxDate = this.anneeScolaire.getDateFin(); // 31 août

  typeEntretienEnum = TypeEntretien;
  statutDemandeEnum = StatutDemandeEnum;
  dateValue = '';

  private router = inject(Router);

  private messageService = inject(MessageService);

  private entretienService = inject(EntretienService);
  private communicationSignatureService = inject(CommunicationSignatureService);
  private communicationEmailsService = inject(CommunicationEmailsService);

  private destroy = new Subject<void>();

  /**
   * Configuration des BOUTONS
   */

  private readonly displayBtnViewDownload = [
    this.statutDemandeEnum.RDV,
    this.statutDemandeEnum.ENCOURS,
    this.statutDemandeEnum.AGENTSIGN,
    this.statutDemandeEnum.CHEFSIGN,
    this.statutDemandeEnum.VALIDE,
  ];

  private readonly displayBtnRdv = [this.statutDemandeEnum.RDV, this.statutDemandeEnum.PREPARE];

  private readonly displayBtnSign = [this.statutDemandeEnum.CHEFSIGN];

  private readonly displayBtnPlus = [
    this.statutDemandeEnum.RDV,
    this.statutDemandeEnum.ENCOURS,
    this.statutDemandeEnum.AGENTCOMMENTAIRE,
  ];
  private readonly displayBtnAgentSign = [
    this.statutDemandeEnum.RDV,
    this.statutDemandeEnum.ENCOURS,
  ];

  private readonly displayBtnEnPreparation = [
    this.statutDemandeEnum.PREPARE,
    this.statutDemandeEnum.RDV,
  ];

  /**
   * FIN Configuration des BOUTONS
   */

  @ViewChild('op') op!: Popover;

  // Signature
  @ViewChild('signatureDialog') signatureDialog!: SignatureComponent;

  ngOnInit(): void {
    this.dateValue = '';

    this.communicationSignatureService.actionSaveSign$
      .pipe(takeUntil(this.destroy))
      .subscribe(action => {
        if (this.entretien.id === action) this.afterSign(action);
      });
  }

  ngOnDestroy() {
    this.destroy.next();
    this.destroy.complete();
  }

  afterSign(entretienId: number) {
    this.entretien.statut = StatutDemandeEnum.VALIDE;
  }

  onDateSelect(event: any) {
    this.dateValue = formatDate(this.dateValue, 'yyyy-MM-dd', 'fr-FR');
    this.entretienService
      .saveDateEntretien(this.dateValue, this.entretien.id)
      .pipe(
        finalize(() => {
          this.dateValue = '';
          this.op.hide();
        }),
      )
      .subscribe({
        next: _ => {
          this.entretien.dateEntretien = this.dateValue;
          this.entretien.statut = StatutDemandeEnum.RDV;

          // Envoi du Mail
          this.communicationEmailsService.envoyerMail(this.entretien.id, 'rdv').subscribe({
            next: _ => {
              this.messageService.add({
                severity: 'success',
                summary: 'Succès',
                detail: 'Mail envoyé avec succès !',
              });
            },
            error: err => {
              console.error("Erreur lors de l'envoi du mail :", err);
              this.messageService.add({
                severity: 'error',
                summary: 'Erreur',
                detail: "Erreur lors de l'envoi du mail",
              });
            },
          });
        },
        error: err => {
          console.error('Error saving date:', err);
        },
      });
  }

  newEntretien(changeStatus: boolean) {
    const navigateToEntretien = () => {
      const path =
        this.entretien.type === this.typeEntretienEnum.ENTRETIEN_FORMATION
          ? '/forms/entretien/form/'
          : '/forms/entretien/pro/';
      this.router.navigate([path, this.entretien.id]);
    };

    if (!changeStatus || this.entretien.statut === this.statutDemandeEnum.AGENTCOMMENTAIRE) {
      navigateToEntretien();
    } else {
      this.entretienService
        .changeStatut(this.statutDemandeEnum.ENCOURS, this.entretien.id)
        .subscribe({
          next: navigateToEntretien,
          error: err => {
            console.error('Error saving date:', err);
          },
        });
    }
  }

  sendToSign() {
    if (!this.entretien) return;
    this.entretienService
      .changeStatut(this.statutDemandeEnum.AGENTSIGN, this.entretien.id)
      .subscribe({
        next: _ => {
          this.entretien.statut = StatutDemandeEnum.AGENTSIGN;

          // Envoi du Mail
          this.communicationEmailsService.envoyerMail(this.entretien.id, 'signature').subscribe({
            next: _ => {
              this.messageService.add({
                severity: 'success',
                summary: 'Succès',
                detail: 'Mail envoyé avec succès !',
              });
            },
            error: err => {
              console.error("Erreur lors de l'envoi du mail :", err);
              this.messageService.add({
                severity: 'error',
                summary: 'Erreur',
                detail: "Erreur lors de l'envoi du mail",
              });
            },
          });
        },
        error: err => {
          console.error('Error saving date:', err);
        },
      });
  }

  onClickGetPdf() {
    if (!this.entretien) return;
    this.getPdf.emit(this.entretien.id);
  }

  onClickViewPdf() {
    if (!this.entretien) return;
    this.viewPdf.emit(this.entretien.id);
  }

  goSignature() {
    if (!this.entretien) {
      return;
    }
    const sendName = this.entretien.superieur
      ? this.entretien.superieur?.prenom + ' ' + this.entretien.superieur?.nom
      : '';
    this.signatureDialog.openDialog(this.entretien.id, sendName, TypesSignatureEnum.SUPERIEUR);
  }

  // Gestion affichage des boutons
  get isInCurrentSchoolYear(): boolean {
    return AnneeScolaire.getAnneeScolaireActuelle().isInCurrentSchoolYear(
      this.entretien.dateEntretien,
    );
  }

  get displayButtonsEnPreparation(): boolean {
    return (
      this.displayBtnEnPreparation.includes(this.entretien.statut) && this.isInCurrentSchoolYear
    );
  }

  get displayButtonsViewDownload(): boolean {
    return this.displayBtnViewDownload.includes(this.entretien.statut);
  }

  get displayButtonRdv(): boolean {
    return this.displayBtnRdv.includes(this.entretien.statut) && this.isInCurrentSchoolYear;
  }

  get displayButtonSign(): boolean {
    return this.displayBtnSign.includes(this.entretien.statut) && this.isInCurrentSchoolYear;
  }

  get displayButtonPlus(): boolean {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const dateEntretien = new Date(this.entretien.dateEntretien);
    dateEntretien.setHours(0, 0, 0, 0);

    const isDatePastOrToday = dateEntretien.getTime() <= today.getTime();
    const isStatutValide = this.displayBtnPlus.includes(this.entretien.statut);
    return isDatePastOrToday && isStatutValide && this.isInCurrentSchoolYear;
  }

  get displayButtonAgentSign(): boolean {
    //displayBtnAgentSign
    return this.displayBtnAgentSign.includes(this.entretien.statut);
  }
}
