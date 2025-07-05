import { Component, inject, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Table, TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { ButtonGroupModule } from 'primeng/buttongroup';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { PanelModule } from 'primeng/panel';
import { DialogModule } from 'primeng/dialog';
import { TooltipModule } from 'primeng/tooltip';
import { Entretien } from '@shared/models/entretien.model';
import { PdfService } from '@shared/services/pdf/pdf.service';
import { NgxExtendedPdfViewerComponent, NgxExtendedPdfViewerModule } from 'ngx-extended-pdf-viewer';
import { environment } from '@environments/environment';
import { SeoService } from '@core/services/seo/seo.service';
import { CommunicationPdfService } from '@shared/services/communications/communication-pdf.service';
import { TypeEntretien } from '@shared/enums/type-entretien.enum';
import { Personne } from '@shared/models/personne.model';
import { Router, RouterModule } from '@angular/router';
import { AdminListeEntretiensHeaderComponent } from './header/header.component';
import { AdminListeEntretiensContentComponent } from './content/content.component';
import { PersonnelService } from '@admin/services/personnel.service';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { Credentials, CredentialsService } from '@core/authentication/credentials.service';
import { Subject, takeUntil } from 'rxjs';
import { HttpResponse } from '@angular/common/http';
import { toBlob } from '@shared/utils/files.util';

export class PersonneImpl {
  id!: string;
  personne!: Personne | null;
  entretienPro!: Entretien[] | null;
  entretienForm!: Entretien[] | null;
}

@Component({
  selector: 'app-admin',
  imports: [
    CommonModule,
    RouterModule,
    NgxExtendedPdfViewerModule,
    TableModule,
    ButtonModule,
    ButtonGroupModule,
    IconFieldModule,
    InputIconModule,
    DialogModule,
    ToastModule,
    TooltipModule,
    PanelModule,
    AdminListeEntretiensHeaderComponent,
    AdminListeEntretiensContentComponent,
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
  private communicationService = inject(CommunicationPdfService);
  private personnelService = inject(PersonnelService);
  private pdfService = inject(PdfService);
  public showViewer = false;

  private _currentUser!: number;

  loading: boolean = true;

  liste!: PersonneImpl[];

  typeEntretienEnum = TypeEntretien;

  @ViewChild(NgxExtendedPdfViewerComponent, { static: false })
  private pdfViewer!: NgxExtendedPdfViewerComponent;
  visibleDetailPdf = false;
  src!: Blob;
  filename: string = '';

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
    this.communicationService.actionGet$.pipe(takeUntil(this.destroy)).subscribe(action => {
      this.getPDF(action);
    });

    this.communicationService.actionView$.pipe(takeUntil(this.destroy)).subscribe(action => {
      this.viewPDF(action);
    });

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
    // const employeNumber = 1043637;
    //const employeNumber = 1072989;

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

  getPDF(id: number) {
    this.loading = true;
    this.pdfService.downloadPdf(id).subscribe({
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
      error: e => console.error('downloadPdf error: ', e),
      complete: () => {
        this.pdfService.resetCache(id);
        this.loading = false;
      },
    });
  }

  viewPDF(id: number) {
    if (!id) return;
    this.loading = true;
    this.pdfService.downloadPdf(id).subscribe({
      next: (response: HttpResponse<Blob>) => {
        const { blob, filename } = toBlob(response);
        this.filename = filename;

        if (blob) {
          this.src = blob;
          this.visibleDetailPdf = true;
        }
      },
      error: e => console.error('viewPDF error: ', e),
      complete: () => {
        this.pdfService.resetCache(id);
        this.loading = false;
      },
    });
  }

  onActivatePdfTab() {
    setTimeout(() => (this.showViewer = true), 100);
  }

  onDialogHide() {
    this.showViewer = false;
    this.pdfViewer.ngOnDestroy();
  }

  applyFilterGlobal(event: Event, table: Table): void {
    const value = (event.target as HTMLInputElement).value;
    table.filterGlobal(value, 'contains');
  }
}
