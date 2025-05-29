import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Entretien } from '@shared/models/entretien.model';

@Component({
  selector: 'app-admin-liste-entretiens-header',
  imports: [CommonModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css',
})
export class AdminListeEntretiensHeaderComponent {
  @Input()
  entretien!: Entretien;
}
