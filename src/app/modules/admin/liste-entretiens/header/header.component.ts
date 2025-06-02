import { Component, inject, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Entretien } from '@shared/models/entretien.model';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { ButtonGroupModule } from 'primeng/buttongroup';
import { AdminListeEntretiensButtonsComponent } from '../buttons/buttons.component';

@Component({
  selector: 'app-admin-liste-entretiens-header',
  imports: [
    CommonModule,
    TableModule,
    ButtonModule,
    ButtonGroupModule,
    AdminListeEntretiensButtonsComponent,
  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css',
})
export class AdminListeEntretiensHeaderComponent implements OnInit {
  @Input()
  entretien!: Entretien;

  @Input()
  displayDate: boolean = true;

  @Input()
  buttons: boolean = true;

  entretiens!: Entretien[];

  ngOnInit(): void {
    this.entretiens = [this.entretien];
    //throw new Error('Method not implemented.');
  }

  getAgentName(): string {
    if (!this.entretien) {
      return '';
    }

    return this.entretien.agent.prenom + ' ' + this.entretien.agent.nom;
  }

  getDateEntretien(): string {
    if (!this.entretien) {
      return '';
    }

    return this.entretien.dateEntretien || '';
  }

  getEntretienStatut(): string {
    if (!this.entretien) {
      return '';
    }
    return this.entretien.statut || '';
  }
}
