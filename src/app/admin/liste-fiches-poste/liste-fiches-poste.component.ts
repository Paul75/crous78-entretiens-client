import { Component, inject, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TableModule, TableRowCollapseEvent, TableRowExpandEvent } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { PersonnesService } from '@shared/services/personnes/personnes.service';
import { Personne } from '@shared/models/personne.model';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { FormsModule } from '@angular/forms';
import { Credentials, CredentialsService } from '@core/authentication/credentials.service';
import { Router } from '@angular/router';
import { Poste } from '@shared/models/poste.model';
import { DialogModule } from 'primeng/dialog';
import { PostesService } from '@shared/services/postes/postes.service';
import { PdfService } from '@shared/services/pdf/pdf.service';
import { NgxExtendedPdfViewerComponent, NgxExtendedPdfViewerModule } from 'ngx-extended-pdf-viewer';
import { DialogFichePosteComponent } from '@shared/components/dialogs/dialog-fiche-poste/dialog-fiche-poste.component';
import { PdfComponent } from '@shared/components/dialogs/pdf/pdf.component';

@Component({
  selector: 'app-admin-liste-personnes',
  imports: [
    CommonModule,
    TableModule,
    ButtonModule,
    ToastModule,
    DialogModule,
    FormsModule,
    NgxExtendedPdfViewerModule,
    DialogFichePosteComponent,
    PdfComponent,
  ],
  providers: [MessageService, PersonnesService],
  templateUrl: './liste-fiches-poste.component.html',
  styleUrl: './liste-fiches-poste.component.scss',
})
export class AdminListeFichesPosteComponent implements OnInit {
  private personnesService = inject(PersonnesService);
  private postesService = inject(PostesService);

  private pdfService = inject(PdfService);

  private messageService = inject(MessageService);
  private credentialsService = inject(CredentialsService);
  private _credentials!: Credentials | null;

  loading: boolean = true;

  personnes!: Personne[];

  ficheSelectionnee: Poste | null = null;
  ficheSelectionneeBack: Poste | null = null;

  visibleDialogForm: boolean = false;

  expandedRows = {};

  @ViewChild(NgxExtendedPdfViewerComponent, { static: false })
  private pdfViewer!: NgxExtendedPdfViewerComponent;
  visibleDetailPdf = false;
  src!: Blob;
  filename: string = '';
  public showViewer = false;

  @ViewChild(PdfComponent) pdfComponent!: PdfComponent;

  constructor(public router: Router) {
    this._credentials = this.credentialsService.credentials;
  }

  ngOnInit(): void {
    this.loading = true;
    this.personnesService.getPersonnes().subscribe({
      next: (items: Personne[]) => {
        this.personnes = items;
      },
      error: e => {
        this.loading = false;
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

  expandAll() {
    this.expandedRows = this.personnes.reduce((acc: any, p) => (acc[p.id] = true) && acc, {});
  }

  collapseAll() {
    this.expandedRows = {};
  }

  onRowExpand(event: TableRowExpandEvent) {
    /*this.messageService.add({
      severity: 'info',
      summary: 'Product Expanded',
      detail: event.data.name,
      life: 3000,
    });*/
  }

  onRowCollapse(event: TableRowCollapseEvent) {
    /*this.messageService.add({
      severity: 'success',
      summary: 'Product Collapsed',
      detail: event.data.name,
      life: 3000,
    });*/
  }

  afficherDetails(fiche: Poste | null | undefined) {
    if (!fiche) {
      // Aucun élément sélectionné
      return;
    }

    // Si sélection multiple, prends le premier
    this.ficheSelectionnee = Array.isArray(fiche) ? (fiche[0] ?? null) : fiche;

    this.ficheSelectionneeBack = this.ficheSelectionnee;

    this.visibleDialogForm = true;
  }

  onDialogHide() {
    this.ficheSelectionnee = null;
    this.ficheSelectionneeBack = null;
  }

  ajouterPoste(personneId: number) {
    this.ficheSelectionnee = { nouveau: true, personneId: personneId } as Poste;

    this.visibleDialogForm = true;
  }

  remplacerParNouveauPoste() {
    if (this.ficheSelectionnee) {
      this.ficheSelectionnee = { nouveau: true } as Poste;
    }
  }

  annulerAjoutPoste() {
    if (this.ficheSelectionnee) {
      delete this.ficheSelectionnee.nouveau;
      this.ficheSelectionnee = this.ficheSelectionneeBack;

      this.visibleDialogForm = false;
    }
  }

  closeDialog() {
    this.ficheSelectionnee = null;
    this.ficheSelectionneeBack = null;

    this.visibleDialogForm = false;
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

            const index = this.personnes.findIndex(p => p.id === newPoste.personne!.id);
            if (index !== -1) {
              if (!this.personnes[index].postes) {
                this.personnes[index].postes = [];
              }
              this.personnes[index].postes.unshift(newPoste);
              this.personnes[index] = { ...this.personnes[index] }; // déclenche changement
            }

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

  handleGetPdf(id: number) {
    this.pdfComponent.downloadFichePoste(id);
  }

  handleViewPdf(id: number) {
    this.pdfComponent.openFichePoste(id);
  }

  onActivatePdfTab() {
    setTimeout(() => (this.showViewer = true), 100);
  }
}
