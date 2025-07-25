import { Component, inject, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToastModule } from 'primeng/toast';
import { ButtonModule } from 'primeng/button';
import { ButtonGroupModule } from 'primeng/buttongroup';
import { DialogModule } from 'primeng/dialog';
import { MessageService } from 'primeng/api';
import { NgxExtendedPdfViewerComponent, NgxExtendedPdfViewerModule } from 'ngx-extended-pdf-viewer';
import { PdfService } from '@shared/services/pdf/pdf.service';
import { HttpResponse } from '@angular/common/http';
import { toBlob } from '@shared/utils/files.util';

@Component({
  selector: 'app-dialog-pdf',
  imports: [
    CommonModule,
    NgxExtendedPdfViewerModule,
    DialogModule,
    ButtonModule,
    ButtonGroupModule,
    ToastModule,
  ],
  templateUrl: './pdf.component.html',
  styleUrl: './pdf.component.scss',
  providers: [MessageService],
})
export class PdfComponent {
  visible: boolean = false;

  @ViewChild(NgxExtendedPdfViewerComponent, { static: false })
  private pdfViewer!: NgxExtendedPdfViewerComponent;
  private pdfService = inject(PdfService);

  public showViewer = false;
  src!: Blob;
  filename: string = '';

  private handlePDF(id: number, type: 'entretien' | 'fichePoste', action: 'view' | 'download') {
    if (!id) return;

    const observable =
      type === 'entretien'
        ? this.pdfService.downloadEntretienPdf(id)
        : this.pdfService.downloadFicheDePostePdf(id);

    observable.subscribe({
      next: (response: HttpResponse<Blob>) => {
        const { blob, filename } = toBlob(response);
        this.filename = filename;

        if (action === 'download') {
          const objectUrl = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = objectUrl;
          a.download = filename;
          a.click();
          URL.revokeObjectURL(objectUrl);
          a.remove();
        } else if (action === 'view') {
          if (blob) {
            this.src = blob;
            this.visible = true;
          }
        }
      },
      error: e => console.error(`action{type} PDF error:`, e),
      complete: () => this.pdfService.resetCache(id),
    });
  }

  //

  // ENTREITNENS
  openEntretien(id: number) {
    this.handlePDF(id, 'entretien', 'view');
  }

  downloadEntretien(id: number) {
    this.handlePDF(id, 'entretien', 'download');
  }

  // FICHE DE POSTE
  openFichePoste(id: number) {
    this.handlePDF(id, 'fichePoste', 'view');
  }

  downloadFichePoste(id: number) {
    this.handlePDF(id, 'fichePoste', 'download');
  }

  onActivatePdfTab() {
    setTimeout(() => (this.showViewer = true), 100);
  }

  onDialogHide() {
    this.showViewer = false;
    this.visible = false;
    this.pdfViewer.ngOnDestroy();
  }
}
