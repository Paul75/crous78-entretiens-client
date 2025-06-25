import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({ providedIn: 'root' })
export class RedirectService {
  constructor(private router: Router) {}

  redirectTo(url: string): void {
    const isExternal = /^https?:\/\//.test(url);
    if (isExternal) {
      window.location.replace(url); // pas de bouton retour
    } else {
      this.router.navigate([url], { replaceUrl: true });
    }
  }
}
