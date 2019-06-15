/*
https://manfredsteyer.github.io/angular-oauth2-oidc/docs/
http://vsavkin.tumblr.com/post/145672529346/angular-router
*/

import { Component, OnInit, OnDestroy, NgZone } from '@angular/core';
import { Router, ActivatedRoute, NavigationStart, NavigationEnd, NavigationError, NavigationCancel } from '@angular/router';

import { from, Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';

import { environment } from '../../../environments/environment';

import { Oauth2Service } from './oauth2.service';


@Component({
  selector: 'app-oauth2',
  templateUrl: './oauth2.component.html',
  styleUrls: ['./oauth2.component.scss']
})
export class Oauth2Component implements OnInit, OnDestroy {

  access_token: string = '';
  id_token: string = '';
  error: boolean = false;
  error_description: string = '';
  subscriptions : Array<any> = [];

  constructor(private zone: NgZone, private router: Router, private route: ActivatedRoute, private oauthService: Oauth2Service) { }

  ngOnDestroy() {
    this.subscriptions.forEach(s => s.unsubscribe());
  }

  ngOnInit() {
    let f = this.router.routerState.snapshot.root.fragment;
    if (f != null) {
      let ff = f.split('&');
      if (ff[0].startsWith('error=')) {
        let param = ff[0].replace('error=','');
        this.router.navigate(['/error', param]);
        return;
      }
    }

    this.subscriptions.push(this.oauthService.loadTokens().subscribe(() => {

      if (this.oauthService.hasError()) {
        this.router.navigate(['/error', this.oauthService.getError()]);
        return;
      } else {
        if (!this.oauthService.hasValidToken()) {
          //se genera el base64 y se lo envía como parametro state oauth
          this.oauthService.login();
        } else {
          //se obtiene state y se redirecciona a esa url.
          this.router.navigate(['/sistema/inicio']);
        }
      }
    }));
  }
}
