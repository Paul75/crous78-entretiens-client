import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Table, TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { ButtonGroupModule } from 'primeng/buttongroup';
import { IconFieldModule } from 'primeng/iconfield';
import { PanelModule } from 'primeng/panel';
import { DialogModule } from 'primeng/dialog';
import { TooltipModule } from 'primeng/tooltip';
import { NgxExtendedPdfViewerModule } from 'ngx-extended-pdf-viewer';
import { environment } from '@environments/environment';
import { Router, RouterModule } from '@angular/router';
import { PersonnelService } from '@admin/services/personnel.service';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { TabsModule } from 'primeng/tabs';
import { BadgeModule } from 'primeng/badge';
import { Credentials, CredentialsService } from '@core/authentication/credentials.service';
import { PersonneImpl } from '@admin/admin.component';
import { FormsModule } from '@angular/forms';
import { ListeEntretiensProFormComponent } from './pro-form/pro-form.component';
import { ListeEntretiensFichePosteComponent } from './fiche-poste/fiche-poste.component';

@Component({
  selector: 'app-admin-liste-entretiens2',
  imports: [
    CommonModule,
    RouterModule,
    NgxExtendedPdfViewerModule,
    TableModule,
    ButtonGroupModule,
    ButtonModule,
    IconFieldModule,
    DialogModule,
    ToastModule,
    TooltipModule,
    TabsModule,
    PanelModule,
    BadgeModule,
    FormsModule,
    ListeEntretiensProFormComponent,
    ListeEntretiensFichePosteComponent,
  ],
  providers: [MessageService, PersonnelService],
  templateUrl: './entretiens-fiches-poste.component.html',
  styleUrl: './entretiens-fiches-poste.component.scss',
})
export class EntretiensFichesPosteComponent implements OnInit, OnDestroy {
  name = environment.application.name;
  angular = environment.application.angular;
  bootstrap = environment.application.bootstrap;
  fontawesome = environment.application.fontawesome;

  private credentialsService = inject(CredentialsService);
  private _credentials!: Credentials | null;
  private messageService = inject(MessageService);
  private personnelService = inject(PersonnelService);

  private _currentUser!: number;

  loading: boolean = true;

  liste!: PersonneImpl[];

  expandedRows = {};

  constructor(public router: Router) {
    this._credentials = this.credentialsService.credentials;
    this._currentUser = this._credentials?.personne.matricule ?? 0;
  }

  ngOnInit(): void {
    this.refreshDatas();
  }

  ngOnDestroy() {}

  applyFilterGlobal(event: Event, table: Table): void {
    const value = (event.target as HTMLInputElement).value;
    table.filterGlobal(value, 'contains');
  }

  get isAdmin(): boolean {
    return this.credentialsService.isAdmin;
  }

  get isRH(): boolean {
    return this.credentialsService.isRH;
  }

  refreshDatas() {
    this.personnelService.getPersonnels(this._currentUser).subscribe({
      next: (entretiens: PersonneImpl[]) => {
        this.liste = entretiens;
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
