import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import {
  NavigationCancel,
  NavigationEnd,
  NavigationError,
  NavigationStart,
  Router,
  RouterOutlet,
} from '@angular/router';
import { ShibbolethService } from '@core/services/shibboleth.service';
import { AuthState } from '@core/types/auth.types';

import { FooterComponent } from '@shared/components/footer/footer.component';
import { HeaderComponent } from '@shared/components/header/header.component';
import { LoaderService } from '@shared/services/loader.service';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-root',
  imports: [CommonModule, RouterOutlet, HeaderComponent, FooterComponent, ProgressSpinnerModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent implements OnInit {
  title = 'client';
  loaderService = inject(LoaderService);
  loading$ = this.loaderService.isLoading$;

  authState$: Observable<AuthState>;

  constructor(
    private shibbolethService: ShibbolethService,
    private router: Router,
  ) {
    this.authState$ = this.shibbolethService.authState$;
    /*this.router.events.subscribe(event => {
      if (event instanceof NavigationStart) {
        this.loaderService.showLoader;
      }
      if (
        event instanceof NavigationEnd ||
        event instanceof NavigationCancel ||
        event instanceof NavigationError
      ) {
        this.loaderService.hideLoader();
      }
    });*/
  }

  ngOnInit(): void {
    // Check for Shibboleth callback parameters
    this.checkShibbolethCallback();
  }

  private checkShibbolethCallback(): void {
    const urlParams = new URLSearchParams(window.location.search);
    const hasCallback =
      urlParams.has('shibboleth') || window.location.pathname.includes('callback');

    if (hasCallback) {
      this.shibbolethService.handleShibbolethCallback().subscribe({
        next: user => {
          console.log('Shibboleth authentication successful:', user);
          this.router.navigate(['/home']);
        },
        error: error => {
          console.error('Shibboleth authentication failed:', error);
          this.router.navigate(['/login']);
        },
      });
    }
  }

  onLogout(): void {
    this.shibbolethService.logout().subscribe(() => {
      this.router.navigate(['/login']);
    });
  }
}
