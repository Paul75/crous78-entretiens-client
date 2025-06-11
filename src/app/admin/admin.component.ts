import { Component, inject, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { ButtonGroupModule } from 'primeng/buttongroup';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { PanelModule } from 'primeng/panel';
import { DialogModule } from 'primeng/dialog';
import { TooltipModule } from 'primeng/tooltip';
import { Entretien } from '@shared/models/entretien.model';
import { PersonnelService } from './services/personnel.service';
import { PdfService } from '@shared/services/pdf/pdf.service';
import { NgxExtendedPdfViewerComponent, NgxExtendedPdfViewerModule } from 'ngx-extended-pdf-viewer';
import { AdminListeEntretiensHeaderComponent } from './liste-entretiens/header/header.component';
import { AdminListeEntretiensContentComponent } from './liste-entretiens/content/content.component';
import { environment } from '@environments/environment';
import { SeoService } from '@core/services/seo/seo.service';
import { CommunicationPdfService } from '@shared/services/entretiens/communication-pdf.service';
import { TypeEntretien } from '@shared/enums/type-entretien.enum';
import { Personne } from '@shared/models/personne.model';
import { RouterModule } from '@angular/router';

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
    TooltipModule,
    PanelModule,
    AdminListeEntretiensHeaderComponent,
    AdminListeEntretiensContentComponent,
  ],
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.scss',
})
export class AdminComponent implements OnInit {
  name = environment.application.name;
  angular = environment.application.angular;
  bootstrap = environment.application.bootstrap;
  fontawesome = environment.application.fontawesome;

  private communicationService = inject(CommunicationPdfService);
  private personnelService = inject(PersonnelService);
  private pdfService = inject(PdfService);
  public showViewer = false;

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
  }

  ngOnInit(): void {
    this.listeDesPersonnes();

    this.communicationService.actionGet$.subscribe(action => {
      this.getPDF(action);
    });

    this.communicationService.actionView$.subscribe(action => {
      this.viewPDF(action);
    });
  }

  listeDesPersonnes() {
    // const employeNumber = 1043637;
    const employeNumber = 1072989;
    this.personnelService.getPersonnels(employeNumber).subscribe((entretiens: PersonneImpl[]) => {
      // console.log(entretiens);
      this.liste = entretiens;
    });
  }

  selectEntretien(ligne: PersonneImpl) {
    console.log(ligne);
  }

  getPDF(id: string) {
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
    });
  }

  viewPDF(id: string) {
    this.pdfService.downloadPdf(id).subscribe({
      next: (data: Blob) => {
        this.src = data;

        this.visibleDetailPdf = true;
      },
      error: e => console.error('viewPDF error: ', e),
    });
  }

  onActivatePdfTab() {
    setTimeout(() => (this.showViewer = true), 100);
  }

  onDialogHide() {
    this.showViewer = false;
    this.pdfViewer.ngOnDestroy();
  }
}
