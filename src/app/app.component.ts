import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';

import { FooterComponent } from '@shared/components/footer/footer.component';
import { HeaderComponent } from '@shared/components/header/header.component';
import { LoaderService } from '@shared/services/loader.service';
import { ProgressSpinnerModule } from 'primeng/progressspinner';

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

  constructor(private router: Router) {
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

  ngOnInit(): void {}

  onLogout(): void {}
}
