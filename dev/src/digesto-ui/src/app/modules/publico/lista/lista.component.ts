import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { DigestoService } from 'src/app/shared/services/digesto.service';
import { Observable, Subject, of } from 'rxjs';
import { FormGroup, FormBuilder } from '@angular/forms';
import { mergeMap, switchMap, map } from 'rxjs/operators';
import { NavegarService } from 'src/app/core/navegar.service';
import { Router } from '@angular/router';
import { MAT_SORT_HEADER_INTL_PROVIDER } from '@angular/material';

@Component({
  selector: 'app-lista',
  templateUrl: './lista.component.html',
  styleUrls: ['./lista.component.scss']
})
export class ListaComponent implements OnInit, OnDestroy {

  subscriptions = [];

  ngOnDestroy(): void {
    this.subscriptions.forEach(s => s.unsubscribe());
  }

  columnas_ = ['numero','fecha','tipo','emisor','archivo'];
  filters: FormGroup = null;
  normas$: Observable<any[]> = null;
  cantidad$: Observable<number> = null;

  /////////////////////////////

  pagina: number = 0;
  pagina$: Observable<any[]> = null;

  inicial_pagina() {
    this.pagina = 0;
    this.buscar$.next();
  }

  siguiente_pagina() {
    this.pagina = this.pagina + 1;
    this.buscar$.next();
  }

  anterior_pagina() {
    this.pagina = this.pagina - 1;
    if (this.pagina < 0) {
      this.pagina = 0;
    }
    this.buscar$.next();
  }

  /////////////////
  
  buscar$ = new Subject<void>();

  columnas() {
    return this.columnas_;
  }

  constructor(
          private service: DigestoService,
          private fb: FormBuilder,
          private router: Router) { 

    let mes_milis = 1000 * 60 * 60 * 24 * 15;
    this.filters = this.fb.group({
      'desde':[new Date((new Date()).getTime() - mes_milis)],
      'hasta':[new Date()],
      'texto':['']
    });

    this.normas$ = this.buscar$.pipe(
      switchMap( _ => {
        let desde = this.desde;
        let hasta = this.hasta;
        let texto = this.texto;
        return this.service.obtener_normas(desde, hasta, 'Aprobadas', texto);
      })
    )

    this.pagina$ = this.normas$.pipe(
      map(ns => ns.sort((a,b) => {
        let a1 = new Date(a.fecha).getTime() + a.numero;
        let b1 = new Date(b.fecha).getTime() + b.numero;
        return a1 - b1;
      })),
      map(ns => {
        let i = this.pagina * 10;
        let f = i + 10;
        return ns.slice(i,f);
      })
    )

    this.cantidad$ = this.normas$.pipe(
      map(ns => ns.length)
    )
  }

  get texto(): string {
    return this.filters.get('texto').value;
  }

  get desde() : Date {
    return this.filters.get('desde').value;
  }

  get hasta() : Date {
    return this.filters.get('hasta').value;
  }

  buscar() {
    this.pagina = 0;
    this.buscar$.next();
  }

  archivoUrl(aid) {
    return this.service.obtener_archivo_url(aid);
  }

  // opción 2 usar href para abrirlo directo en otra pestaña
  detalle_norma_url(nid) {
    return `/sistema/normativas/detalle/${nid}`;
  }

  acceder() {
    console.log('navegnado');
    this.router.navigate(['/oauth2']).then((v) => {console.log(v)});
  }  

  ngOnInit() {
  }

}
