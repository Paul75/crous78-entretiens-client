import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '@environments/environment';

@Injectable()
export class DatasCoreService {
  private http = inject(HttpClient);
  private backendUrl = environment.backend;

  getAllLines(): Observable<any> {
    return this.http.get(`${this.backendUrl}/datas`);
  }

  getShibboleth(): Observable<any> {
    return this.http.get(`${this.backendUrl}/shibboleth`);
  }

  verifStatutShibbo(): Observable<any> {
    return this.http.get(`${this.backendUrl}/shibboleth/session`);
  }
}
