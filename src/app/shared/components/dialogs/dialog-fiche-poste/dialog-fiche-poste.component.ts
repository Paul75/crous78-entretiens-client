import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MessageService } from 'primeng/api';
import { FormsModule } from '@angular/forms';
import { DialogModule } from 'primeng/dialog';
import { ToolbarModule } from 'primeng/toolbar';
import { SelectButtonModule } from 'primeng/selectbutton';
import { ButtonModule } from 'primeng/button';
import { ButtonGroupModule } from 'primeng/buttongroup';
import { EditorModule } from 'primeng/editor';
import { InputIconModule } from 'primeng/inputicon';
import { InputMaskModule } from 'primeng/inputmask';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { PopoverModule } from 'primeng/popover';
import { SelectModule } from 'primeng/select';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { ToastModule } from 'primeng/toast';
import { ToggleButtonModule } from 'primeng/togglebutton';

@Component({
  selector: 'app-dialog-fiche-poste',
  imports: [
    CommonModule,
    FormsModule,
    TableModule,
    ButtonModule,
    ButtonGroupModule,
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
    EditorModule,
    DialogModule,
    ToolbarModule,
  ],
  templateUrl: './dialog-fiche-poste.component.html',
  styleUrl: './dialog-fiche-poste.component.scss',
  providers: [MessageService],
})
export class DialogFichePosteComponent {
  @Input() ficheSelectionnee: any;
  @Input() visible: boolean = false;

  @Output() submit = new EventEmitter<any>();
  @Output() cancel = new EventEmitter<void>();
  @Output() hide = new EventEmitter<void>();

  yesNoOptions: any[] = [
    { label: 'OUI', value: true },
    { label: 'NON', value: false },
  ];
}
