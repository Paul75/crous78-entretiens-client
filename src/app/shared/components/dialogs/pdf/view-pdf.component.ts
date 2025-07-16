import { AfterViewInit, Component, inject, ViewChild } from '@angular/core';
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
  selector: 'app-home-dialog-pdf',
  imports: [
    CommonModule,
    NgxExtendedPdfViewerModule,
    DialogModule,
    ButtonModule,
    ButtonGroupModule,
    ToastModule,
  ],
  templateUrl: './view-pdf.component.html',
  styleUrl: './view-pdf.component.scss',
  providers: [MessageService],
})
export class ViewPdfComponent implements AfterViewInit {
  display = false;

  @ViewChild(NgxExtendedPdfViewerComponent, { static: false })
  private pdfViewer!: NgxExtendedPdfViewerComponent;
  public showViewer = false;
  src!: Blob;

  private messageService = inject(MessageService);
  private pdfService = inject(PdfService);
  filename: string = '';

  ngAfterViewInit(): void {}

  getPDF(id: number) {
    if (!id) return;
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
      error: e => console.error('downloadPdf error: ', e),
      complete: () => {
        this.pdfService.resetCache(id);
      },
    });
  }

  viewPDF(id: number) {
    if (!id) return;
    this.pdfService.downloadEntretienPdf(id).subscribe({
      next: (response: HttpResponse<Blob>) => {
        const { blob, filename } = toBlob(response);
        this.filename = filename;
        if (blob) {
          this.src = blob;
          this.display = true;
        }
      },
      error: e => console.error('viewPDF error: ', e),
      complete: () => {
        this.pdfService.resetCache(id);
      },
    });
  }

  open(id: number) {
    this.viewPDF(id);
  }

  onActivatePdfTab() {
    setTimeout(() => (this.showViewer = true), 100);
  }

  onDialogHide() {
    this.showViewer = false;
    this.pdfViewer.ngOnDestroy();
  }

  openDialog() {
    this.display = true;
  }

  cloeDialog() {
    this.display = false;
  }
}
