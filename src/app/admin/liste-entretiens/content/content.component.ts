import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Entretien } from '@shared/models/entretien.model';

import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { ButtonGroupModule } from 'primeng/buttongroup';
import { AdminListeEntretiensHeaderComponent } from '../header/header.component';
import { AdminListeEntretiensButtonsComponent } from '../buttons/buttons.component';

@Component({
  selector: 'app-admin-liste-entretiens-content',
  imports: [
    CommonModule,
    TableModule,
    ButtonModule,
    ButtonGroupModule,
    AdminListeEntretiensHeaderComponent,
    AdminListeEntretiensButtonsComponent,
  ],
  templateUrl: './content.component.html',
  styleUrl: './content.component.scss',
})
export class AdminListeEntretiensContentComponent {
  @Input()
  entretiens!: Entretien[];

  @Output() getPdf = new EventEmitter<number>();
  @Output() viewPdf = new EventEmitter<number>();

  handleGetPdf(id: number) {
    if (!id) return;
    this.getPdf.emit(id);
  }

  handleViewPdf(id: number) {
    if (!id) return;
    this.viewPdf.emit(id);
  }
}
