import { Component, OnInit } from '@angular/core';

import { environment } from '../../../environments/environment'
import { Router } from '@angular/router';
import { Oauth2Service } from '../oauth2/oauth2.service';

@Component({
  selector: 'app-loader',
  templateUrl: './loader.component.html',
  styleUrls: ['./loader.component.scss']
})
export class LoaderComponent implements OnInit {

  visible: boolean = false;
  cabecera: string;
  version: string;
  tituloSistema: string;
  subtituloSistema: string;
  desarrolloSistema: string;
  logoSistema: string

  constructor(private router: Router, private oauthService: Oauth2Service) {
    this.cabecera = environment.loader.cabecera;
    this.version = environment.loader.version;
    this.tituloSistema = environment.loader.tituloSistema;
    this.subtituloSistema = environment.loader.subtituloSistema;
    this.desarrolloSistema = environment.loader.desarrolloSistema;
    this.logoSistema = environment.loader.logoSistema
  }

  ngOnInit() {
    if (this.oauthService.hasValidToken()) {
      //se obtiene state y se redirecciona a esa url.
      this.router.navigate(['/sistema/inicio']);
    } else {
      this.visible = true;
    }
  }

  acceder() {
    console.log('navegnado');
    this.router.navigate(['/oauth2']).then((v) => {console.log(v)});
  }

}


