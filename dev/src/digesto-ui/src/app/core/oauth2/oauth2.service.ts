import { Injectable } from '@angular/core';
import { from, Subscription, Observable, of } from 'rxjs';
import { filter, flatMap } from 'rxjs/operators';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';

import { AuthConfig, OAuthService, NullValidationHandler, JwksValidationHandler, OAuthEvent, OAuthErrorEvent, OAuthInfoEvent } from 'angular-oauth2-oidc';

import { environment } from '../../../environments/environment';

export const authConfig: AuthConfig = {
  issuer: environment.oidp_issuer,
  redirectUri: window.location.origin + '/oauth2',
  oidc: true,
  requireHttps: false,
  clientId: environment.client_id,
  dummyClientSecret: environment.client_id,
  scope: 'openid profile email',
  sessionChecksEnabled: true,
  showDebugInformation: true
}

export interface LogoutData {
  redirect_to: string
}

@Injectable({
  providedIn: 'root'
})
export class Oauth2Service {

  error: boolean = false;
  error_description: string = null;

  constructor(private oauthService: OAuthService, private http: HttpClient) { 
    this.oauthService.configure(authConfig);
    this.oauthService.tokenValidationHandler = new NullValidationHandler();
    
    //this.oauthService.events.pipe(filter((e1:OAuthEvent) => e1 instanceof OAuthErrorEvent)).subscribe((err:OAuthErrorEvent) => {
    this.oauthService.events.subscribe((e:OAuthEvent) => {
       console.log(e);
    });
    
    this.oauthService.loadDiscoveryDocument().then(() => {
      console.log('documento cargado');
    });

  }

  loadTokens() {
    let p = new Promise((res, rej) => {
      this.oauthService.loadDiscoveryDocument().then(() => {
        this.oauthService.tryLogin().then(() => {
          console.log('tryLogin ok');
          this.error = false;
          this.error_description = null;
          res();
        },
        (err) => {
          console.log('tryLogin error');
          this.error = true;
          this.error_description = err.params['error'];
          res();
        });
      })
    });
    return from(p);
  }

  hasError():boolean {
    return this.error;
  }

  getError(): string {
    return this.error_description;
  }

  login() {
    this.oauthService.loadDiscoveryDocument().then(() => {
      if (!this.oauthService.hasValidAccessToken()) {
        this.oauthService.initImplicitFlow();
      }
    });
  }

  hasValidToken() {
    return this.oauthService.hasValidAccessToken();
  }


  getId() {
    let c = this.oauthService.getIdentityClaims();
    return c['sub'];
  }

  getIdentity() {
    let c = this.oauthService.getIdentityClaims();
    return c;
  }

  getPrimaryEmail() {
    let c = this.oauthService.getIdentityClaims();
    if (c['email_verified']) {
      return c['email'];
    } else {
      return null;
    }
    
  }

  getNames() {
    return {
      
    };
  }

  getIdToken(): string {
    return this.oauthService.getIdToken();
  }

  getAppId(): string {
    return environment.client_id;
  }

  logout():Observable<LogoutData> {
    let url = `${environment.loginApiUrl}/logout`;
    //let url = `${OIDC}oauth2/auth/sessions/login/revoke`;
    let data = {
      'id_token': this.getIdToken(),
      'app_id': this.getAppId()
    }
    return this.http.post<LogoutData>(url, data).pipe(
      flatMap(
        ld => {
          // si retorne ok entonces elimino los datos de la sesion local
          this.oauthService.logOut(true);
          return of(ld);
      })
    );
  }

  /*
  logout(): Observable<LogoutData> {
    this.oauthService.logOut(true);
    return of({redirect_to:''});
  }
  */

}
