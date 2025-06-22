import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { environment } from '@environments/environment';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import { AuthState } from '@core/types/auth.types';

@Component({
  selector: 'app-header',
  imports: [CommonModule, RouterModule, NgbDropdownModule],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent {
  appInfo = environment.appInfo;
  applicationName = environment.application.name;

  @Input() authState: AuthState | null = null;
  @Output() logout = new EventEmitter<void>();

  collapsed = true;

  onLogout(): void {
    this.logout.emit();
  }
}
