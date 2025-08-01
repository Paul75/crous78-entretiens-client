import { Component, inject, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Table, TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { ButtonGroupModule } from 'primeng/buttongroup';
import { IconFieldModule } from 'primeng/iconfield';
import { PanelModule } from 'primeng/panel';
import { DialogModule } from 'primeng/dialog';
import { TooltipModule } from 'primeng/tooltip';
import { environment } from '@environments/environment';
import { SeoService } from '@core/services/seo/seo.service';
import { TypeEntretien } from '@shared/enums/type-entretien.enum';
import { Router, RouterModule } from '@angular/router';
import { AdminListeEntretiensHeaderComponent } from './header/header.component';
import { AdminListeEntretiensContentComponent } from './content/content.component';
import { PersonnelService } from '@admin/services/personnel.service';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { Credentials, CredentialsService } from '@core/authentication/credentials.service';
import { Subject } from 'rxjs';
import { PersonneImpl } from '@admin/admin.component';
import { Poste } from '@shared/models/poste.model';
import { PostesService } from '@shared/services/postes/postes.service';
import { FormsModule } from '@angular/forms';
import { DialogFichePosteComponent } from '@shared/components/dialogs/dialog-fiche-poste/dialog-fiche-poste.component';
import { PdfComponent } from '@shared/components/dialogs/pdf/pdf.component';

@Component({
  selector: 'app-admin',
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
    PanelModule,
    FormsModule,
    AdminListeEntretiensHeaderComponent,
    AdminListeEntretiensContentComponent,
    DialogFichePosteComponent,
    PdfComponent,
  ],
  providers: [MessageService, PersonnelService],
  templateUrl: './liste-entretiens.component.html',
  styleUrl: './liste-entretiens.component.scss',
})
export class ListeEntretiensComponent implements OnInit, OnDestroy {
  name = environment.application.name;
  angular = environment.application.angular;
  bootstrap = environment.application.bootstrap;
  fontawesome = environment.application.fontawesome;

  private credentialsService = inject(CredentialsService);
  private _credentials!: Credentials | null;
  private messageService = inject(MessageService);
  private personnelService = inject(PersonnelService);
  private postesService = inject(PostesService);
  public showViewer = false;

  private _currentUser!: number;

  loading: boolean = true;

  liste!: PersonneImpl[];

  typeEntretienEnum = TypeEntretien;

  @ViewChild(PdfComponent) pdfComponent!: PdfComponent;

  visibleDetailPdf = false;
  src!: Blob;
  filename: string = '';

  ficheSelectionnee: Poste | null = null;
  visibleDialogForm: boolean = false;

  private destroy = new Subject<void>();

  constructor(
    private seoService: SeoService,
    public router: Router,
  ) {
    this._credentials = this.credentialsService.credentials;
    this._currentUser = this._credentials?.personne.matricule ?? 0;

    const content =
      'This application was developed with ' +
      this.angular +
      ' and ' +
      this.bootstrap +
      ' It applies Routing, Lazy loading and Progressive Web App (PWA)';

    const title = 'Entretiens annuels : Admin';

    this.seoService.setMetaDescription(content);
    this.seoService.setMetaTitle(title);
  }

  ngOnInit(): void {
    this.refreshDatas();
  }

  ngOnDestroy() {
    this.destroy.next();
    this.destroy.complete();
  }

  get isAdmin(): boolean {
    return this.credentialsService.isAdmin;
  }

  get isRH(): boolean {
    return this.credentialsService.isRH;
  }

  refreshDatas() {
    this.personnelService.getPersonnels(this._currentUser).subscribe({
      next: (entretiens: PersonneImpl[]) => {
        this.liste = entretiens;
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

  selectEntretien(ligne: PersonneImpl) {
    // console.log(ligne);
  }

  handleGetPdf(id: number) {
    this.pdfComponent.downloadEntretien(id);
  }

  handleViewPdf(id: number) {
    this.pdfComponent.openEntretien(id);
  }

  viewFicheDePostePDF(id: number) {
    this.pdfComponent.openFichePoste(id);
  }

  getFicheDePostePDF(id: number) {
    this.pdfComponent.downloadFichePoste(id);
  }

  onDialogHide() {
    this.showViewer = false;
  }

  applyFilterGlobal(event: Event, table: Table): void {
    const value = (event.target as HTMLInputElement).value;
    table.filterGlobal(value, 'contains');
  }

  ajouterPoste(personneId: number) {
    this.ficheSelectionnee = { nouveau: true, personneId: personneId } as Poste;

    this.visibleDialogForm = true;
  }

  annulerAjoutPoste() {
    if (this.ficheSelectionnee) {
      delete this.ficheSelectionnee.nouveau;

      this.visibleDialogForm = false;
    }
  }

  closeDialog() {
    this.ficheSelectionnee = null;

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

            const index = this.liste.findIndex(p => p.personne!.id === newPoste.personne!.id);
            if (index !== -1) {
              this.liste[index].fichePoste!.unshift(newPoste);
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
}
