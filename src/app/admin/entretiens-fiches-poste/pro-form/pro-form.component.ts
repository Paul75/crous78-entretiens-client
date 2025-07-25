import { Component, inject, Input, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { ButtonGroupModule } from 'primeng/buttongroup';
import { IconFieldModule } from 'primeng/iconfield';
import { PanelModule } from 'primeng/panel';
import { DialogModule } from 'primeng/dialog';
import { TooltipModule } from 'primeng/tooltip';
import { NgxExtendedPdfViewerModule } from 'ngx-extended-pdf-viewer';
import { Router, RouterModule } from '@angular/router';
import { PersonnelService } from '@admin/services/personnel.service';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { TabsModule } from 'primeng/tabs';
import { Credentials, CredentialsService } from '@core/authentication/credentials.service';
import { FormsModule } from '@angular/forms';
import { Entretien } from '@shared/models/entretien.model';
import { AdminListeEntretiensButtonsComponent } from '../buttons/buttons.component';
import { StatutDemandeEnum } from '@shared/enums/statut.demande.enum';
import { PdfComponent } from '@shared/components/dialogs/pdf/pdf.component';

@Component({
  selector: 'app-admin-liste-entretiens-pro-form',
  imports: [
    CommonModule,
    RouterModule,
    NgxExtendedPdfViewerModule,
    TableModule,
    ButtonGroupModule,
    ButtonModule,
    IconFieldModule,
    DialogModule,
    ToastModule,
    TooltipModule,
    TabsModule,
    PanelModule,
    FormsModule,
    AdminListeEntretiensButtonsComponent,
    PdfComponent,
  ],
  providers: [MessageService, PersonnelService],
  templateUrl: './pro-form.component.html',
  styleUrl: './pro-form.component.scss',
})
export class ListeEntretiensProFormComponent {
  @Input()
  liste!: Entretien[];

  private credentialsService = inject(CredentialsService);
  private _credentials!: Credentials | null;

  private _currentUser!: number;

  loading: boolean = false;

  @ViewChild(PdfComponent) pdfComponent!: PdfComponent;

  constructor(public router: Router) {
    this._credentials = this.credentialsService.credentials;
    this._currentUser = this._credentials?.personne.matricule ?? 0;
  }

  get isAdmin(): boolean {
    return this.credentialsService.isAdmin;
  }

  get isRH(): boolean {
    return this.credentialsService.isRH;
  }

  getStatutClasses(statut: StatutDemandeEnum) {
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

  handleGetPdf(id: number) {
    this.pdfComponent.downloadEntretien(id);
  }

  handleViewPdf(id: number) {
    this.pdfComponent.openEntretien(id);
  }
}
