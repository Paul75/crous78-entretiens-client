import { Component, inject, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { ButtonGroupModule } from 'primeng/buttongroup';
import { TypeEntretien } from '@shared/enums/type-entretien.enum';
import { Entretien } from '@shared/models/entretien.model';
import { NgxExtendedPdfViewerModule } from 'ngx-extended-pdf-viewer';
import { SignatureComponent } from '@shared/components/dialogs/signature/signature.component';
import { PdfComponent } from '@shared/components/dialogs/pdf/pdf.component';
import { StatutDemandeEnum } from '@shared/enums/statut.demande.enum';
import { TypesSignatureEnum } from '@shared/enums/types.signature.enum';
import { CommunicationSignatureService } from '@shared/services/communications/communication-signature.service';
import { AgentCommentaireComponent } from '@shared/components/dialogs/agent-commentaire/agent-commentaire.component';
import { CommunicationCommentairesService } from '@shared/services/communications/communication-commentaires.service';
import { CredentialsService } from '@core/authentication/credentials.service';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-home-item',
  imports: [
    CommonModule,
    NgxExtendedPdfViewerModule,
    ButtonModule,
    ButtonGroupModule,
    SignatureComponent,
    AgentCommentaireComponent,
    PdfComponent,
  ],
  templateUrl: './item.component.html',
  styleUrl: './item.component.scss',
})
export class HomeItemComponent implements OnInit, OnDestroy {
  @Input()
  entretien!: Entretien;

  // Signature
  @ViewChild('agentCommentaireDialog') agentCommentaireDialog!: AgentCommentaireComponent;
  // Signature
  @ViewChild('signatureDialog') signatureDialog!: SignatureComponent;

  // PDF
  @ViewChild('pdfDialog') pdfDialog!: PdfComponent;

  typeEntretienEnum = TypeEntretien;
  statutDemandeEnum = StatutDemandeEnum;

  private communicationSignatureService = inject(CommunicationSignatureService);
  private communicationCommentairesService = inject(CommunicationCommentairesService);
  private credentialsService = inject(CredentialsService);

  private readonly displayBtnViewDownload = [
    this.statutDemandeEnum.ENCOURS,
    this.statutDemandeEnum.AGENTCOMMENTAIRE,
    this.statutDemandeEnum.AGENTSIGN,
    this.statutDemandeEnum.CHEFSIGN,
    this.statutDemandeEnum.VALIDE,
  ];

  private readonly displayBtnAgentCommentaire = [this.statutDemandeEnum.AGENTSIGN];

  private readonly displayBtnSign = [
    this.statutDemandeEnum.AGENTCOMMENTAIRE,
    this.statutDemandeEnum.AGENTSIGN,
  ];

  private destroy = new Subject<void>();

  ngOnInit(): void {
    this.communicationSignatureService.actionSaveSign$
      .pipe(takeUntil(this.destroy))
      .subscribe(action => {
        if (this.entretien.id === action) this.entretien.statut = StatutDemandeEnum.CHEFSIGN;
      });

    this.communicationCommentairesService.actionSaveCommentaire$
      .pipe(takeUntil(this.destroy))
      .subscribe(action => {
        if (this.entretien.id === action)
          this.entretien.statut = StatutDemandeEnum.AGENTCOMMENTAIRE;
      });
  }

  ngOnDestroy(): void {
    this.destroy.next();
    this.destroy.complete();
  }

  getStatutClasses() {
    const statut: StatutDemandeEnum = this.entretien!.statut;
    return {
      preparation: statut === StatutDemandeEnum.PREPARE,
      'rendez-vous': statut === StatutDemandeEnum.RDV,
      saisie: statut === StatutDemandeEnum.ENCOURS,
      'commentaires-personne': statut === StatutDemandeEnum.AGENTCOMMENTAIRE,
      'signe-personne': statut === StatutDemandeEnum.AGENTSIGN,
      'signe-chef': statut === StatutDemandeEnum.CHEFSIGN,
      valide: statut === StatutDemandeEnum.VALIDE,
    };
  }

  getAgentName(): string {
    if (!this.credentialsService.isAuthenticated) {
      return '';
    }
    return (
      this.credentialsService.credentials?.personne.prenom +
      ' ' +
      this.credentialsService.credentials?.personne.nom
    );
  }

  getDateEntretien(): string {
    if (!this.entretien) {
      return '';
    }

    return this.entretien.dateEntretien || '';
  }

  getEntretienStatut(): string {
    if (!this.entretien) {
      return '';
    }
    return this.entretien.statut || '';
  }

  getPDF(id: number) {
    if (!id) return;
    this.pdfDialog.downloadEntretien(id);
  }

  viewPDF(id: number) {
    if (!id) return;
    this.pdfDialog.openEntretien(id);
  }

  goSignature() {
    if (!this.entretien) {
      return;
    }
    const sendName = this.entretien.personne.prenom + ' ' + this.entretien.personne.nom;
    this.signatureDialog.openDialog(this.entretien.id, sendName, TypesSignatureEnum.PERSONNE);
  }

  goAgentCommentaire() {
    if (!this.entretien) {
      return;
    }
    const sendName = this.entretien.personne.prenom + ' ' + this.entretien.personne.nom;
    this.agentCommentaireDialog.openDialog(
      this.entretien.id,
      sendName,
      TypesSignatureEnum.PERSONNE,
      this.entretien.type,
    );
  }

  // Gestion affichage des boutons

  get displayButtonsViewDownload(): boolean {
    return this.displayBtnViewDownload.includes(this.entretien.statut);
  }

  get displayButtonAgentCommentaire(): boolean {
    return this.displayBtnAgentCommentaire.includes(this.entretien.statut);
  }

  get displayButtonSign(): boolean {
    return this.displayBtnSign.includes(this.entretien.statut);
  }
}
