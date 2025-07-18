import { Component, inject, Input, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { ButtonGroupModule } from 'primeng/buttongroup';
import { IconFieldModule } from 'primeng/iconfield';
import { PanelModule } from 'primeng/panel';
import { DialogModule } from 'primeng/dialog';
import { TooltipModule } from 'primeng/tooltip';
import { PdfService } from '@shared/services/pdf/pdf.service';
import { NgxExtendedPdfViewerModule } from 'ngx-extended-pdf-viewer';
import { environment } from '@environments/environment';
import { Router, RouterModule } from '@angular/router';
import { PersonnelService } from '@admin/services/personnel.service';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { TabsModule } from 'primeng/tabs';
import { Credentials, CredentialsService } from '@core/authentication/credentials.service';
import { FormsModule } from '@angular/forms';
import { Entretien } from '@shared/models/entretien.model';
import { AdminListeEntretiensButtonsComponent } from '../buttons/buttons.component';
import { HttpResponse } from '@angular/common/http';
import { toBlob } from '@shared/utils/files.util';
import { StatutDemandeEnum } from '@shared/enums/statut.demande.enum';

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
  ],
  providers: [MessageService, PersonnelService],
  templateUrl: './pro-form.component.html',
  styleUrl: './pro-form.component.scss',
})
export class ListeEntretiensProFormComponent implements OnInit, OnDestroy {
  name = environment.application.name;
  angular = environment.application.angular;
  bootstrap = environment.application.bootstrap;
  fontawesome = environment.application.fontawesome;

  private credentialsService = inject(CredentialsService);
  private _credentials!: Credentials | null;
  private pdfService = inject(PdfService);
  public showViewer = false;

  private _currentUser!: number;

  loading: boolean = false;

  filename: string = '';

  visibleDetailPdf = false;
  src!: Blob;

  @Input()
  liste!: Entretien[];

  constructor(public router: Router) {
    this._credentials = this.credentialsService.credentials;
    this._currentUser = this._credentials?.personne.matricule ?? 0;
  }

  ngOnInit(): void {}

  ngOnDestroy() {}

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

  onActivatePdfTab() {
    setTimeout(() => (this.showViewer = true), 100);
  }

  onDialogHide() {
    this.showViewer = false;
    // this.pdfViewer.ngOnDestroy();
  }

  getEntretienPDF(id: number) {
    this.loading = true;
    this.pdfService.downloadEntretienPdf(id).subscribe({
      next: (response: HttpResponse<Blob>) => {
        const { blob, filename } = toBlob(response);
        const objectUrl = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = objectUrl;
        a.download = filename;
        a.click();
        URL.revokeObjectURL(objectUrl);
        a.remove();
      },
      error: e => console.error('getEntretienPDF error: ', e),
      complete: () => {
        this.pdfService.resetCache(id);
        this.loading = false;
      },
    });
  }

  viewEntretienPDF(id: number) {
    if (!id) return;
    this.loading = true;
    this.pdfService.downloadEntretienPdf(id).subscribe({
      next: (response: HttpResponse<Blob>) => {
        const { blob, filename } = toBlob(response);
        this.filename = filename;

        if (blob) {
          this.src = blob;
          this.visibleDetailPdf = true;
        }
      },
      error: e => console.error('viewEntretienPDF error: ', e),
      complete: () => {
        this.pdfService.resetCache(id);
        this.loading = false;
      },
    });
  }

  handleGetPdf(id: number) {
    this.getEntretienPDF(id);
  }

  handleViewPdf(id: number) {
    this.viewEntretienPDF(id);
  }
}
