import { Component, inject, Input, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { ButtonGroupModule } from 'primeng/buttongroup';
import { CommunicationPdfService } from '@shared/services/entretiens/communication-pdf.service';
import { TypeEntretien } from '@shared/enums/type-entretien.enum';
import { Entretien } from '@shared/models/entretien.model';
import { NgxExtendedPdfViewerModule } from 'ngx-extended-pdf-viewer';
import { SignatureComponent } from '@shared/components/dialogs/signature/signature.component';
import { ViewPdfComponent } from '@shared/components/dialogs/pdf/view-pdf.component';
import { StatutDemandeEnum } from '@shared/enums/statut.deande.enum';

@Component({
  selector: 'app-home-item',
  imports: [
    CommonModule,
    NgxExtendedPdfViewerModule,
    ButtonModule,
    ButtonGroupModule,
    SignatureComponent,
    ViewPdfComponent,
  ],
  templateUrl: './item.component.html',
  styleUrl: './item.component.scss',
})
export class HomeItemComponent implements OnInit {
  @Input()
  entretien!: Entretien | null;

  // Signature
  @ViewChild('signatureDialog') signatureDialog!: SignatureComponent;

  // PDF
  @ViewChild('pdfDialog') pdfDialog!: ViewPdfComponent;

  typeEntretienEnum = TypeEntretien;

  private communicationService = inject(CommunicationPdfService);

  ngOnInit(): void {
    this.communicationService.actionGet$.subscribe(action => {
      this.getPDF(action);
    });

    this.communicationService.actionView$.subscribe(action => {
      this.viewPDF(action);
    });
  }

  getStatutClasses() {
    const statut: StatutDemandeEnum = this.entretien!.statut;
    return {
      preparation: statut === StatutDemandeEnum.PREPARE,
      'rendez-vous': statut === StatutDemandeEnum.RDV,
      saisie: statut === StatutDemandeEnum.ENCOURS,
      'signe-personne': statut === StatutDemandeEnum.AGENTSIGN,
      'signe-chef': statut === StatutDemandeEnum.CHEFSIGN,
      valide: statut === StatutDemandeEnum.VALIDE,
    };
  }

  getAgentName(): string {
    if (!this.entretien) {
      return '';
    }

    return this.entretien.personne.prenom + ' ' + this.entretien.personne.nom;
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

  getPDF(id: string) {
    if (!id) return;
    this.pdfDialog.getPDF(id);
  }

  viewPDF(id: string) {
    if (!id) return;
    this.pdfDialog.viewPDF(id);
  }

  goSignature() {
    if (!this.entretien) {
      return;
    }
    const sendName = this.entretien.personne.prenom + ' ' + this.entretien.personne.nom;
    this.signatureDialog.openDialog(sendName);
  }
}
