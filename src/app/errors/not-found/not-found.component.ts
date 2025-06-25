import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { environment } from '@environments/environment';

@Component({
  selector: 'app-not-found',
  imports: [],
  templateUrl: './not-found.component.html',
  styleUrl: './not-found.component.scss',
})
export class NotFoundComponent {
  errorHttp!: string;

  // tslint:disable-next-line:quotemark
  messageErrorDefault = "Vous n'avez pas le droit d'accéder à cette application";
  // tslint:disable-next-line:quotemark
  message401 = 'Votre session a expiré. Cliquez ci-dessous pour continuer';

  errorMessage = '';

  constructor(private route: ActivatedRoute) {}

  ngOnInit() {
    this.errorHttp = this.route.snapshot.params['id'];

    switch (+this.errorHttp) {
      case 401:
        this.errorMessage = this.message401;
        break;

      case 500:
        this.errorMessage = 'Erreur serveur';
        break;

      default:
        this.errorMessage = this.messageErrorDefault;
        break;
    }
  }

  returnLogin() {
    window.location.replace(environment.shibboleth.loginUrl);
  }
}
