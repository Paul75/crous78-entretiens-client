import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { ShibbolethService } from '@core/services/shibboleth.service';
import { AuthState } from '@core/types/auth.types';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent implements OnInit {
  authState$: Observable<AuthState>;

  constructor(
    public shibbolethService: ShibbolethService,
    private router: Router,
  ) {
    this.authState$ = this.shibbolethService.authState$;
  }

  ngOnInit(): void {
    // Redirect if already authenticated
    this.authState$.subscribe(state => {
      if (state.isAuthenticated) {
        this.router.navigate(['/home']);
      }
    });

    // this.onLogin();
  }

  onLogin(): void {
    this.shibbolethService.login();
  }
}
