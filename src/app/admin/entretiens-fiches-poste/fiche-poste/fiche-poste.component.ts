import { Component, inject, Input, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { ButtonGroupModule } from 'primeng/buttongroup';
import { IconFieldModule } from 'primeng/iconfield';
import { PanelModule } from 'primeng/panel';
import { DialogModule } from 'primeng/dialog';
import { TooltipModule } from 'primeng/tooltip';
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
import { Poste } from '@shared/models/poste.model';
import { PostesService } from '@shared/services/postes/postes.service';
import { DialogFichePosteComponent } from '@shared/components/dialogs/dialog-fiche-poste/dialog-fiche-poste.component';
import { PdfComponent } from '@shared/components/dialogs/pdf/pdf.component';

@Component({
  selector: 'app-admin-liste-fiches-poste',
  imports: [
    CommonModule,
    RouterModule,
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
    PdfComponent,
  ],
  providers: [MessageService, PersonnelService],
  templateUrl: './fiche-poste.component.html',
  styleUrl: './fiche-poste.component.scss',
})
export class ListeEntretiensFichePosteComponent {
  name = environment.application.name;
  angular = environment.application.angular;
  bootstrap = environment.application.bootstrap;
  fontawesome = environment.application.fontawesome;

  private credentialsService = inject(CredentialsService);
  private postesService = inject(PostesService);
  private messageService = inject(MessageService);
  private _credentials!: Credentials | null;
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

  handleGetPdf(id: number) {
    this.pdfComponent.downloadFichePoste(id);
  }

  handleViewPdf(id: number) {
    this.pdfComponent.openFichePoste(id);
  }
}
