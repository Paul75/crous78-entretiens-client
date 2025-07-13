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
import { InputMaskModule } from 'primeng/inputmask';
import { SplitterModule } from 'primeng/splitter';
import { MessageService } from 'primeng/api';
import { InputIconModule } from 'primeng/inputicon';
import { FormsModule, NgForm } from '@angular/forms';
import { InputNumberModule } from 'primeng/inputnumber';
import { ToggleButtonModule } from 'primeng/togglebutton';
import { Credentials, CredentialsService } from '@core/authentication/credentials.service';
import { Router } from '@angular/router';
import { SelectButtonModule } from 'primeng/selectbutton';
import { EditorModule } from 'primeng/editor';
import { Poste } from '@shared/models/poste.model';

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
    SelectButtonModule,
    InputTextModule,
    InputNumberModule,
    InputIconModule,
    InputMaskModule,
    ToggleButtonModule,
    SplitterModule,
    EditorModule,
    FormsModule,
  ],
  providers: [MessageService, PersonnesService],
  templateUrl: './liste-fiches-poste.component.html',
  styleUrl: './liste-fiches-poste.component.scss',
})
export class AdminListeFichesPosteComponent implements OnInit {
  private personnesService = inject(PersonnesService);

  private messageService = inject(MessageService);
  private credentialsService = inject(CredentialsService);
  private _credentials!: Credentials | null;

  loading: boolean = true;

  personnes!: Personne[];

  ficheSelectionnee: Personne | null = null;

  yesNoOptions: any[] = [
    { label: 'OUI', value: true },
    { label: 'NON', value: false },
  ];

  constructor(public router: Router) {
    this._credentials = this.credentialsService.credentials;
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

  get premierPoste() {
    if (!this.ficheSelectionnee) return null;
    if (!this.ficheSelectionnee.postes) {
      this.ficheSelectionnee.postes = [{} as Poste];
    }
    if (this.ficheSelectionnee.postes.length === 0) {
      this.ficheSelectionnee.postes.push({} as Poste);
    }
    return this.ficheSelectionnee.postes[0];
  }

  afficherDetails(fiche: any) {
    this.ficheSelectionnee = fiche;
  }

  onSubmit(form: NgForm) {
    if (form.valid) {
      const today = new Date().toISOString().split('T')[0]; // "2025-07-13"

      if (this.ficheSelectionnee?.postes?.[0]) {
        this.ficheSelectionnee.postes[0].dateAffectation = today;
      }

      this.personnesService.savePersonne(this.ficheSelectionnee as Personne).subscribe({
        next: (p: Personne) => {
          this.ficheSelectionnee = p;

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
  }
}
