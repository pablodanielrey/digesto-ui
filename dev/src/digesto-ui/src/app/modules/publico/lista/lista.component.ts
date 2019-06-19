import { Component, OnInit, OnDestroy, ViewChild, AfterViewInit } from '@angular/core';
import { DigestoService } from 'src/app/shared/services/digesto.service';
import { Observable, Subject, of, BehaviorSubject, combineLatest } from 'rxjs';
import { FormGroup, FormBuilder } from '@angular/forms';
import { mergeMap, switchMap, map, tap } from 'rxjs/operators';
import { NavegarService } from 'src/app/core/navegar.service';
import { Router } from '@angular/router';
import { MAT_SORT_HEADER_INTL_PROVIDER, PageEvent, Sort, MatSort, MatPaginator } from '@angular/material';

@Component({
  selector: 'app-lista',
  templateUrl: './lista.component.html',
  styleUrls: ['./lista.component.scss']
})
export class ListaComponent implements OnInit, OnDestroy, AfterViewInit {

  subscriptions = [];

  ngOnDestroy(): void {
    this.subscriptions.forEach(s => s.unsubscribe());
  }

  @ViewChild(MatSort, null) sort: MatSort;
  @ViewChild(MatPaginator, null) paginator: MatPaginator;

  columnas_ = ['numero', 'fecha', 'tipo', 'emisor', 'archivo'];
  filters: FormGroup = null;
  normas$: Observable<any[]> = null;
  normas_ordenadas$: Observable<any[]> = null;
  normas_paginadas$: Observable<any[]> = null;

  estados$: Observable<any[]> = null;
  mostrarFiltros:boolean=false;

  tamano: number = 10;

  ordenar$ = new BehaviorSubject<Sort>({active:'numero',direction:''});
  pagina$ = new BehaviorSubject<PageEvent>({length: 0, pageIndex: 0, pageSize: 10});
  buscar$ = new BehaviorSubject<void>(null);

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

    this.normas_ordenadas$ = combineLatest(this.ordenar$, this.buscar$).pipe(
      tap(v => console.log(v)),
      switchMap(valores => {
        return this.normas$.pipe(
          tap(ns => this.tamano = ns.length),
          map(ns => { ns.forEach(e => e.fecha = new Date(e.fecha)); return ns; }),
          map(ns => ns.sort((a,b) => {
            let s = valores[0];
            console.log(s);
            if (s['active'] == 'numero') {
              let n1 = (s['direction'] == 'desc') ? a : b;
              let n2 = (s['direction'] == 'desc') ? b : a;
              let n =  n1.numero - n2.numero;
              return (n == 0) ? n1.fecha.getTime() - n2.fecha.getTime() : n;
            }
            return (a.fecha.getTime() + a.numero) - (b.fecha.getTime() + b.numero);
          }))
        );
      }),
      tap(v => console.log(v))      
    )
    
    this.normas_paginadas$ = combineLatest(this.pagina$, this.normas_ordenadas$).pipe(
      map(valores => {
        let pagina = valores[0];
        let normas = valores[1];
        let i = pagina.pageIndex * pagina.pageSize;
        let f = i + pagina.pageSize;
        return normas.slice(i,f);
      })
    )    

    this.estados$ = of(['Todas','Pendientes','Aprobadas']);

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
    this.buscar$.next();
  }

  ngAfterViewInit() {
    this.sort.sortChange.pipe(
      tap(v => console.log(v))
    ).subscribe(s => {
      this.ordenar$.next(s);
    });

    this.paginator.page.pipe(
      tap(v => console.log(v)),
    ).subscribe(p => {
      this.pagina$.next(p);
    })
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
