import { Component, inject, OnInit, ViewChild } from '@angular/core';
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
import { RouterModule } from '@angular/router';
import { AdminListeEntretiensHeaderComponent } from './header/header.component';
import { AdminListeEntretiensContentComponent } from './content/content.component';
import { PersonnelService } from '@admin/services/personnel.service';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';

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
export class ListeEntretiensComponent implements OnInit {
  name = environment.application.name;
  angular = environment.application.angular;
  bootstrap = environment.application.bootstrap;
  fontawesome = environment.application.fontawesome;

  private messageService = inject(MessageService);
  private communicationService = inject(CommunicationPdfService);
  private personnelService = inject(PersonnelService);
  private pdfService = inject(PdfService);
  public showViewer = false;

  loading: boolean = true;

  liste!: PersonneImpl[];

  typeEntretienEnum = TypeEntretien;

  @ViewChild(NgxExtendedPdfViewerComponent, { static: false })
  private pdfViewer!: NgxExtendedPdfViewerComponent;
  visibleDetailPdf = false;
  src!: Blob;

  constructor(private seoService: SeoService) {
    const content =
      'This application was developed with ' +
      this.angular +
      ' and ' +
      this.bootstrap +
      ' It applies Routing, Lazy loading and Progressive Web App (PWA)';

    const title = 'Entretiens annuels : Admin';

    this.seoService.setMetaDescription(content);
    this.seoService.setMetaTitle(title);

    this.communicationService.actionGet$.subscribe(action => {
      this.getPDF(action);
    });

    this.communicationService.actionView$.subscribe(action => {
      this.viewPDF(action);
    });
  }

  ngOnInit(): void {
    this.refreshDatas();
  }

  refreshDatas() {
    // const employeNumber = 1043637;
    const employeNumber = 1072989;

    this.personnelService.getPersonnels(employeNumber).subscribe({
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
      next: (data: Blob) => {
        const a = document.createElement('a');
        const objectUrl = URL.createObjectURL(data);
        a.href = objectUrl;
        a.download = 'entretien_pro.pdf';
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
    this.loading = true;
    this.pdfService.downloadPdf(id).subscribe({
      next: (data: Blob) => {
        this.src = data;

        this.visibleDetailPdf = true;
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
