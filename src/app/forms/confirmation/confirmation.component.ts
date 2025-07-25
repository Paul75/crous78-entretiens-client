import { Component, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { PdfComponent } from '@shared/components/dialogs/pdf/pdf.component';

@Component({
  selector: 'app-form-confirm',
  imports: [CommonModule, RouterLink, ButtonModule, PdfComponent],
  templateUrl: './confirmation.component.html',
  styleUrl: './confirmation.component.scss',
})
export class ConfirmationComponent {
  entretienId!: number;

  // PDF
  @ViewChild(PdfComponent) pdfDialog!: PdfComponent;

  constructor(private route: ActivatedRoute) {}

  ngOnInit() {
    this.entretienId = Number(this.route.snapshot.paramMap.get('id'));
  }

  ngAfterContentChecked() {}

  viewPDF(id: number) {
    if (!id) return;
    this.pdfDialog.openEntretien(id);
  }
}
