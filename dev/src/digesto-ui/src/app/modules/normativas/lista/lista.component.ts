import { Component, OnInit, OnDestroy, ViewChild, AfterViewInit, NgZone } from '@angular/core';
import { DigestoService } from 'src/app/shared/services/digesto.service';
import { Observable, Subject, of, merge, combineLatest, BehaviorSubject } from 'rxjs';
import { FormGroup, FormBuilder } from '@angular/forms';
import { mergeMap, switchMap, tap, map } from 'rxjs/operators';
import { NavegarService } from 'src/app/core/navegar.service';
import { MatSort, Sort, MatPaginator, PageEvent } from '@angular/material';
import { nsend } from 'q';

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

  // columnas_ = ['numero','tipo','fecha','creada','emisor','archivo','visibilidad'];
  columnasDesktop : string[] = ['numero', 'fecha', 'tipo', 'emisor', 'creada', 'archivo','visibilidad'];
  columnasCelular : string[] = ['numero', 'fecha', 'tipo', 'archivo','visibilidadCel'];
  filters: FormGroup = null;
  normas$: Observable<any[]> = null;
  normas_ordenadas$: Observable<any[]> = null;
  normas_paginadas$: Observable<any[]> = null;

  estados$: Observable<any[]> = null;
  mostrarFiltros:boolean=false;

  tamano: number = 10;

  cargando$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);  

  buscar$ = new BehaviorSubject<void>(null);
  ordenar$ = new BehaviorSubject<Sort>({active:'numero',direction:''});
  pagina$ = new BehaviorSubject<PageEvent>({length: 0, pageIndex: 0, pageSize: 10});


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
          private navegar: NavegarService,
          private zone: NgZone) { 

    let mes_milis = 1000 * 60 * 60 * 24 * 30;
    this.filters = this.fb.group({
      'desde':[new Date((new Date()).getTime() - mes_milis)],
      'hasta':[new Date()],
      'texto':[''],
      'estado':['Todas']
    });

    this.normas$ = this.buscar$.pipe(
      tap(v => { 
        this.zone.run(() => { this.cargando$.next(true); })
      }),      
      switchMap( _ => {
        let desde = this.desde;
        let hasta = this.hasta;
        let estado = this.estado;
        let texto = this.texto;
        return this.service.obtener_normas(desde, hasta, estado, texto);
      })
    )

    this.estados$ = of(['Todas','Pendientes','Aprobadas']);

    this.normas_ordenadas$ = combineLatest(this.ordenar$, this.buscar$).pipe(
      tap(v => console.log(v)),
      switchMap(valores => {
        return this.normas$.pipe(
          tap(ns => this.tamano = ns.length),
          map(ns => { ns.forEach(e => e.fecha = new Date(e.fecha)); return ns; }),
          map(ns => {
            let s = valores[0];
            let dir = s['direction']
            return ns.sort((a,b) => {
              if (s['active'] == 'numero') {
                return this._comparar_numero(a,b,dir);
              }
              return this._comparar_creada(a,b,dir);
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
      tap(v => { 
        this.zone.run(() => { this.cargando$.next(false); })
      })      
    )
  }

  _comparar_creada(a, b, dir) {
    let n1 = (dir == 'desc') ? a : b;
    let n2 = (dir == 'desc') ? b : a;
    let n = n1.creada.getTime() - n2.creada.getTime();
    return (n == 0) ? n1.numero - n2.numero : n;
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

  get estado(): string {
    return this.filters.get('estado').value;
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

  archivoUrl(aid) {
    return this.service.obtener_archivo_url(aid);
  }

  // opción 1 usar navegar para ir al detalle de la norma.
  detalle_norma(nid) {
    this.subscriptions.push(
      this.navegar.navegar({
        url:`/sistema/normativas/detalle/${nid}`,
        params: {}
      }).subscribe(e => {})
    );
  }

  // opción 2 usar href para abrirlo directo en otra pestaña
  detalle_norma_url(nid) {
    return `/sistema/normativas/detalle/${nid}`;
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

  ngOnInit() {

  }

  cambiar_visibilidad(norma) {
    this.subscriptions.push(
      this.service.cambiar_visibilidad(norma.id, !norma.visible).subscribe(_ => {
        this.buscar$.next();
      })
    );
  }


}
