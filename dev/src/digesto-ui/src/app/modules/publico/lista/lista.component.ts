import { Component, OnInit, OnDestroy, ViewChild, AfterViewInit, NgZone } from '@angular/core';
import { DigestoService } from 'src/app/shared/services/digesto.service';
import { Observable, Subject, of, BehaviorSubject, combineLatest } from 'rxjs';
import { FormGroup, FormBuilder } from '@angular/forms';
import { mergeMap, switchMap, map, tap } from 'rxjs/operators';
import { NavegarService } from 'src/app/core/navegar.service';
import { Router } from '@angular/router';
import { MAT_SORT_HEADER_INTL_PROVIDER, PageEvent, Sort, MatSort, MatPaginator, MatSnackBar } from '@angular/material';
import { UpdateService } from 'src/app/shared/services/update.service';

import { environment } from '../../../../environments/environment';


@Component({
  selector: 'app-lista',
  templateUrl: './lista.component.html',
  styleUrls: ['./lista.component.scss']
})
export class ListaComponent implements OnInit, OnDestroy, AfterViewInit {

  environment = environment;
  subscriptions = [];

  ngOnDestroy(): void {
    this.subscriptions.forEach(s => s.unsubscribe());
  }

  @ViewChild(MatSort, null) sort: MatSort;
  @ViewChild(MatPaginator, null) paginator: MatPaginator;

  // columnas_ = ['numero', 'fecha', 'tipo', 'emisor', 'archivo'];
  columnasDesktop : string[] = ['numero', 'fecha', 'tipo', 'emisor', 'archivo'];
  columnasCelular : string[] = ['numero', 'fecha', 'tipo', 'archivo'];
  filters: FormGroup = null;
  normas$: Observable<any[]> = null;
  normas_ordenadas$: Observable<any[]> = null;
  normas_paginadas$: Observable<any[]> = null;

  cargando$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  estados$: Observable<any[]> = null;
  mostrarFiltros:boolean=false;

  tamano$: Observable<number>;

  ordenar$ = new BehaviorSubject<Sort>({active:'fecha',direction:'desc'});
  pagina$ = new BehaviorSubject<PageEvent>({length: 0, pageIndex: 0, pageSize: 10});
  buscar$ = new BehaviorSubject<void>(null);

  columnas() {
    /*
      detecta si es un dispositivo touch
    */
    if (typeof window.ontouchstart !== 'undefined') {
      return this.columnasCelular;
    } else {
      return this.columnasDesktop;
    }
  }
  constructor(
          private service: DigestoService,
          private fb: FormBuilder,
          private router: Router,
          private zone: NgZone,
          private update: UpdateService,
          private snackBar: MatSnackBar) { 

    let mes_milis = 1000 * 60 * 60 * 24 * 60;
    this.filters = this.fb.group({
      'desde':[new Date((new Date()).getTime() - mes_milis)],
      'hasta':[new Date()],
      'texto':['']
    });

    this.normas$ = this.buscar$.pipe(
      tap(v => { 
        this.zone.run(() => { this.cargando$.next(true); })
      }),
      switchMap( _ => {
        let desde = this.desde;
        let hasta = this.hasta;
        let texto = this.texto;
        return this.service.obtener_normas(desde, hasta, 'Aprobadas', texto);
      })
    )

    this.tamano$ = this.normas$.pipe(
      map(ns => ns.length),
      tap(num => num == 0 ? this.snackBar.open('No se encontraron resultados','', { duration: 2000}) : null)
    )

    this.normas_ordenadas$ = combineLatest(this.ordenar$, this.buscar$).pipe(
      tap(v => console.log(v)),
      switchMap(valores => {
        return this.normas$.pipe(
          map(ns => {
            let s = valores[0];
            let dir = s['direction'];
            if (dir == '') {
               return ns;
            }
            return ns.sort((a,b) => {
              if (s['active'] == 'numero') {
                return this._comparar_numero(a, b, dir);
              }
              if (s['active'] == 'fecha') {
                return this._comparar_fecha(a, b, dir);
              }
              if (s['active'] == 'tipo') {
                return this._comparar_tipo(a, b, dir);
              }              
              return this._comparar_creada(a, b, dir);
            })
          })
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
      }),
      tap(v => this.zone.run(() => { this.cargando$.next(false); }))
    )    

    this.estados$ = of(['Todas','Pendientes','Aprobadas']);

  }

  _comparar_tipo(a, b, dir) {
    let n1 = (dir == 'desc') ? a : b;
    let n2 = (dir == 'desc') ? b : a;
    let n = n1.tipo.localeCompare(n2.tipo);
    return (n == 0) ? this._comparar_fecha(a,b,'asc') : n;
  }

  _comparar_creada(a, b, dir) {
    let n1 = (dir == 'desc') ? a : b;
    let n2 = (dir == 'desc') ? b : a;
    let n = n1.creada.getTime() - n2.creada.getTime();
    return (n == 0) ? n1.numero - n2.numero : n;
  }

  _comparar_fecha(a, b, dir) {
    let n1 = (dir == 'desc') ? a : b;
    let n2 = (dir == 'desc') ? b : a;
    let n = n1.fecha.getTime() - n2.fecha.getTime();
    return (n == 0) ? this._comparar_numero(a,b,'asc') : n;
  }

  _comparar_numero(a, b, dir) {
      let n1 = (dir == 'desc') ? a : b;
      let n2 = (dir == 'desc') ? b : a;
      let n = n1.numero - n2.numero;
      return (n == 0) ? n1.fecha.getTime() - n2.fecha.getTime() : n;
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
    this.paginator.firstPage();
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
    this.update.checkForUpdate();
  }



}
