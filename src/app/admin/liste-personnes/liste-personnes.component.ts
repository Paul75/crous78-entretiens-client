import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { ButtonGroupModule } from 'primeng/buttongroup';
import { PopoverModule } from 'primeng/popover';
import { DatePickerModule } from 'primeng/datepicker';
import { PersonnesService } from '@shared/services/personnes/personnes.service';
import { Personne } from '@shared/models/personne.model';
import { InputTextModule } from 'primeng/inputtext';
import { TagModule } from 'primeng/tag';
import { SelectModule } from 'primeng/select';
import { ToastModule } from 'primeng/toast';
import { InputMask } from 'primeng/inputmask';
import { MessageService } from 'primeng/api';
import { InputIconModule } from 'primeng/inputicon';
import { FormsModule } from '@angular/forms';
import { DEFAULT_PERSONNE } from '@shared/constants/personne.constants';
import { InputNumberModule } from 'primeng/inputnumber';
import { ToggleButtonModule } from 'primeng/togglebutton';
import { Credentials, CredentialsService } from '@core/authentication/credentials.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin-liste-personnes',
  imports: [
    CommonModule,
    TableModule,
    ButtonModule,
    ButtonGroupModule,
    DatePickerModule,
    PopoverModule,
    ToastModule,
    TagModule,
    SelectModule,
    InputTextModule,
    InputNumberModule,
    InputIconModule,
    InputMask,
    ToggleButtonModule,
    FormsModule,
  ],
  providers: [MessageService, PersonnesService],
  templateUrl: './liste-personnes.component.html',
  styleUrl: './liste-personnes.component.scss',
})
export class AdminListePersonnesComponent implements OnInit {
  private personnesService = inject(PersonnesService);

  private messageService = inject(MessageService);
  private credentialsService = inject(CredentialsService);
  private _credentials!: Credentials | null;

  loading: boolean = true;

  personnes!: Personne[];

  clonedPersonnes: { [s: string]: Personne } = {};

  constructor(public router: Router) {
    this._credentials = this.credentialsService.credentials;

    if (!this.isAdmin) {
      this.router.navigate(['/home']);
    }
  }

  ngOnInit(): void {
    this.loading = true;
    this.personnesService.getPersonnes().subscribe({
      next: (items: Personne[]) => {
        this.personnes = items;
      },
      error: e => {
        this.loading = false;
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

  get isAdmin(): boolean {
    return this.credentialsService.isAdmin;
  }

  get isRH(): boolean {
    return this.credentialsService.isRH;
  }

  displayIsActif(isActif: boolean): string {
    return isActif ? 'Oui' : 'Non';
  }

  onRowEditInit(personne: Personne) {
    this.clonedPersonnes[personne.id as number] = { ...personne };
  }

  onRowEditSave(personne: Personne) {
    this.loading = true;
    // console.log(personne);
    this.personnesService.savePersonne(personne).subscribe({
      next: (p: Personne) => {
        delete this.clonedPersonnes[personne.id as number];
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'La ligne a été modifiée',
        });
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

  onRowEditCancel(personne: Personne, index: number) {
    this.personnes[index] = this.clonedPersonnes[personne.id as number];
    delete this.clonedPersonnes[personne.id as number];
  }

  addRow() {
    let newPersonne: Personne = DEFAULT_PERSONNE;
    newPersonne.isNew = true;

    newPersonne.id = this.generateUniqueId();
    this.personnes.unshift(newPersonne); // Ajoute la nouvelle personne au début du tableau
    this.onRowEditInit(newPersonne); // Active le mode édition pour la nouvelle ligne
  }

  delRow(personne: Personne, index: number) {
    if (personne.isNew) {
      this.onRowEditCancel(personne, index);
    } else {
      this.loading = true;
      this.personnesService.deletePersonne(personne.id).subscribe({
        next: () => {
          this.personnes[index].isActif = false;
          this.onRowEditInit(this.personnes[index]);
        },
        error: e => {
          this.messageService.add({
            severity: 'error',
            summary: 'Erreur',
            detail: 'Impossible de supprimer la ligne',
          });
          this.loading = false;
        },
        complete: () => {
          this.loading = false;
        },
      });
    }
  }

  onSelectDate(date: Date) {
    // this.dateValue = formatDate(date, 'yyyy-MM-dd', 'fr-FR');
  }

  private generateUniqueId(): number {
    // Implémentez une logique pour générer un ID unique
    return Math.max(...this.personnes.map(p => p.id as number), 0) + 1;
  }
}
