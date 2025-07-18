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
import {
  Credentials,
  CredentialsService,
  Personne,
} from '@core/authentication/credentials.service';
import { FormsModule } from '@angular/forms';
import { Entretien } from '@shared/models/entretien.model';
import { HttpResponse } from '@angular/common/http';
import { toBlob } from '@shared/utils/files.util';
import { Poste } from '@shared/models/poste.model';
import { PostesService } from '@shared/services/postes/postes.service';
import { DialogFichePosteComponent } from '@shared/components/dialogs/dialog-fiche-poste/dialog-fiche-poste.component';

@Component({
  selector: 'app-admin-liste-fiches-poste',
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
    DialogFichePosteComponent,
  ],
  providers: [MessageService, PersonnelService],
  templateUrl: './fiche-poste.component.html',
  styleUrl: './fiche-poste.component.scss',
})
export class ListeEntretiensFichePosteComponent implements OnInit, OnDestroy {
  name = environment.application.name;
  angular = environment.application.angular;
  bootstrap = environment.application.bootstrap;
  fontawesome = environment.application.fontawesome;

  private credentialsService = inject(CredentialsService);
  private postesService = inject(PostesService);
  private messageService = inject(MessageService);
  private _credentials!: Credentials | null;
  private pdfService = inject(PdfService);
  public showViewer = false;

  private _currentUser!: number;

  loading: boolean = false;

  filename: string = '';

  visibleDetailPdf = false;
  src!: Blob;

  @Input()
  liste!: Poste[];

  @Input()
  personne!: Personne;

  ficheSelectionnee: Poste | null = null;

  visibleDialogForm: boolean = false;

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

  onActivatePdfTab() {
    setTimeout(() => (this.showViewer = true), 100);
  }

  onDialogHide() {
    this.showViewer = false;
    // this.pdfViewer.ngOnDestroy();
  }

  closeDialog() {
    this.ficheSelectionnee = null;

    this.visibleDialogForm = false;
  }

  afficherDetails(fiche: Poste | Poste[] | null | undefined) {
    if (!fiche) {
      // Aucun élément sélectionné
      return;
    }

    // Si sélection multiple, prends le premier
    this.ficheSelectionnee = Array.isArray(fiche) ? (fiche[0] ?? null) : fiche;

    this.visibleDialogForm = true;
  }

  ajouterPoste(personneId: number) {
    this.ficheSelectionnee = { nouveau: true, personneId: personneId } as Poste;

    this.visibleDialogForm = true;
  }

  annulerAjoutPoste() {
    if (this.ficheSelectionnee) {
      delete this.ficheSelectionnee.nouveau;
      this.ficheSelectionnee = null;

      this.visibleDialogForm = false;
    }
  }

  enregistrerFiche(datasForm: Poste | null | undefined) {
    if (datasForm) {
      this.ficheSelectionnee = datasForm;

      const today = new Date().toISOString().split('T')[0]; // "2025-07-13"

      if (this.ficheSelectionnee) {
        this.ficheSelectionnee.dateAffectation = today;
      }

      if (this.ficheSelectionnee?.nouveau) {
        this.postesService.createPoste(this.ficheSelectionnee as Poste).subscribe({
          next: (newPoste: Poste) => {
            newPoste.nouveau = false;

            this.liste.unshift(newPoste);

            this.closeDialog();

            this.messageService.add({
              severity: 'success',
              summary: 'Success',
              detail: 'La ligne a été créée',
            });
          },
          error: e => {
            this.messageService.add({
              severity: 'error',
              summary: 'Erreur',
              detail: 'Impossible de créer la ligne',
            });
          },
          complete: () => {
            this.loading = false;
          },
        });
      } else {
        this.postesService.savePoste(this.ficheSelectionnee as Poste).subscribe({
          next: (p: Poste) => {
            p.nouveau = false;

            this.ficheSelectionnee = p;

            this.closeDialog();

            this.messageService.add({
              severity: 'success',
              summary: 'Success',
              detail: 'La ligne a été modifiée',
            });
          },
          error: e => {
            this.messageService.add({
              severity: 'error',
              summary: 'Erreur',
              detail: 'Impossible de modifier la ligne',
            });
          },
          complete: () => {
            this.loading = false;
          },
        });
      }
    }
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

  viewFicheDePostePDF(posteId: number) {
    if (!posteId) return;
    this.loading = true;
    this.pdfService.downloadFicheDePostePdf(posteId).subscribe({
      next: (response: HttpResponse<Blob>) => {
        const { blob, filename } = toBlob(response);
        this.filename = filename;

        if (blob) {
          this.src = blob;
          this.visibleDetailPdf = true;
        }
      },
      error: e => console.error('viewFicheDePostePDF error: ', e),
      complete: () => {
        this.pdfService.resetCache(posteId);
        this.loading = false;
      },
    });
  }

  getFicheDePostePDF(posteId: number) {
    this.pdfService.downloadFicheDePostePdf(posteId).subscribe({
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
      error: e => console.error('getFicheDePostePDF error: ', e),
      complete: () => {
        this.pdfService.resetCache(posteId);
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
