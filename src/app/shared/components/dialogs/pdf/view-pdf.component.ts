import { AfterViewInit, Component, inject, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToastModule } from 'primeng/toast';
import { ButtonModule } from 'primeng/button';
import { ButtonGroupModule } from 'primeng/buttongroup';
import { DialogModule } from 'primeng/dialog';
import { MessageService } from 'primeng/api';
import { NgxExtendedPdfViewerComponent, NgxExtendedPdfViewerModule } from 'ngx-extended-pdf-viewer';
import { PdfService } from '@shared/services/pdf/pdf.service';

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

  ngAfterViewInit(): void {}

  getPDF(id: number) {
    if (!id) return;
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

  viewPDF(id: number) {
    if (!id) return;
    this.pdfService.downloadPdf(id).subscribe({
      next: (data: Blob) => {
        this.src = data;

        // this.visibleDetailPdf = true;
        this.display = true;
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

  openDialog() {
    this.display = true;
  }

  cloeDialog() {
    this.display = false;
  }
}
