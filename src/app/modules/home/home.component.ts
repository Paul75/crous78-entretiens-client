import { Component, inject, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PdfService } from '@shared/services/pdf/pdf.service';
import { AnneeScolaire } from '@shared/utils/annee-scolaire.util';
import {
  EntretienImpl,
  EntretienService,
} from '@shared/services/entretiens/entretien.service';
import { environment } from '@environments/environment';
import { SeoService } from '@core/services/seo/seo.service';
import { ButtonGroupModule } from 'primeng/buttongroup';
import { ButtonModule } from 'primeng/button';
import {
  NgxExtendedPdfViewerComponent,
  NgxExtendedPdfViewerModule,
} from 'ngx-extended-pdf-viewer';
import { DialogModule } from 'primeng/dialog';
import { TableModule } from 'primeng/table';
import { TypeEntretien } from '@shared/enums/type-entretien.enum';
import { HomeItemComponent } from './item/item.component';
import { CommunicationPdfService } from '@shared/services/entretiens/communication-pdf.service';

export enum StatutDemande {
  PREPARE = 'En préparation',
  RDV = 'Rendez-vous pris',
  ENCOURS = 'En cours de saisie',
  VALIDE = 'Entretien validé',
}

export enum ColorDemande {
  PREPARE = '#ffd966',
  RDV = '#e69138',
  ENCOURS = '#6aa84f',
  VALIDE = '#3d85c6',
}

@Component({
  selector: 'app-home',
  imports: [
    CommonModule,
    ButtonGroupModule,
    ButtonModule,
    DialogModule,
    NgxExtendedPdfViewerModule,
    TableModule,
    HomeItemComponent
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent implements OnInit {
  name = environment.application.name;
  angular = environment.application.angular;
  bootstrap = environment.application.bootstrap;
  fontawesome = environment.application.fontawesome;

  currentYear = new Date();
  anneeScolaire = new AnneeScolaire(this.currentYear.getFullYear());

  currentEntretien = '1';
  currentUser = '1043637';

  statutDemande = StatutDemande;
  public showViewer = false;

  @ViewChild(NgxExtendedPdfViewerComponent, { static: false })
  private pdfViewer!: NgxExtendedPdfViewerComponent;
  visibleDetailPdf = false;
  src!: Blob;


  private communicationService = inject(CommunicationPdfService);
  private entretienService = inject(EntretienService);
  typeEntretienEnum = TypeEntretien;

  listeEntretien!: EntretienImpl;

  constructor(private seoService: SeoService, private pdfService: PdfService) {
    const content =
      'This application was developed with ' +
      this.angular +
      ' and ' +
      this.bootstrap +
      ' It applies Routing, Lazy loading and Progressive Web App (PWA)';

    const title = 'Entretiens annuels';

    this.seoService.setMetaDescription(content);
    this.seoService.setMetaTitle(title);
  }

  ngOnInit(): void {
    this.entretienService.getEntretienByMatricule(this.currentUser).subscribe({
      next: (data: EntretienImpl) => {
        this.listeEntretien = data;
      },
      error: (e) => console.error('getEntretienByMatricule error: ', e),
    });

    this.communicationService.actionGet$.subscribe(action => {
      this.getPDF(action);
    });

    this.communicationService.actionView$.subscribe(action => {
      this.viewPDF(action);
    });
  }

  getEntretienId(typeEntretien: TypeEntretien): string {
    if (!this.listeEntretien) {
      return '';
    }
    if(typeEntretien == TypeEntretien.ENTRETIEN_PRO) {
      return this.listeEntretien.entretienPro && this.listeEntretien.entretienPro.id.toString() || '';
    }

    return this.listeEntretien.entretienForm && this.listeEntretien.entretienForm.id.toString() || '';
  }
  
  getAgentName(typeEntretien: TypeEntretien): string {
    if (!this.listeEntretien) {
      return '';
    }
    if(typeEntretien == TypeEntretien.ENTRETIEN_PRO) {
      return this.listeEntretien.entretienPro?.agent.prenom + ' ' + this.listeEntretien.entretienPro?.agent.nom;
    }

    return this.listeEntretien.entretienForm?.agent.prenom + ' ' + this.listeEntretien.entretienForm?.agent.nom;
  }

  getDateEntretien(typeEntretien: TypeEntretien): string {
    if (!this.listeEntretien) {
      return '';
    }
    
    if(typeEntretien == TypeEntretien.ENTRETIEN_PRO) {
      return this.listeEntretien.entretienPro?.dateEntretien || '';
    }

    return this.listeEntretien.entretienForm?.dateEntretien || '';
  }

  getEntretienStatut(typeEntretien: TypeEntretien): string{
    if (!this.listeEntretien) {
      return '';
    }
    
    if(typeEntretien == TypeEntretien.ENTRETIEN_PRO) {
      return this.listeEntretien.entretienPro?.statut || '';
    }
    return this.listeEntretien.entretienForm?.statut || '';
  }

  getColorStatut(item: StatutDemande): ColorDemande {
    const colorMap: Record<StatutDemande, ColorDemande> = {
      [StatutDemande.PREPARE]: ColorDemande.PREPARE,
      [StatutDemande.RDV]: ColorDemande.RDV,
      [StatutDemande.ENCOURS]: ColorDemande.ENCOURS,
      [StatutDemande.VALIDE]: ColorDemande.VALIDE,
    };

    return colorMap[item] || ColorDemande.PREPARE;
  }

  onActivatePdfTab() {
    setTimeout(() => (this.showViewer = true), 100);
  }

  onDialogHide() {
    this.showViewer = false;
    this.pdfViewer.ngOnDestroy();
  }

  getPDF(id: string) {
    if(!id) return;
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
      error: (e) => console.error('downloadPdf error: ', e),
    });
  }

  viewPDF(id: string) {
    if(!id) return;
    this.pdfService.downloadPdf(id).subscribe({
      next: (data: Blob) => {
        this.src = data;

        this.visibleDetailPdf = true;
      },
      error: (e) => console.error('viewPDF error: ', e),
    });
  }
}
