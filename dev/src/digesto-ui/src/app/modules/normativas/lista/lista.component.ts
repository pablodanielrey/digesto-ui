import { Component, OnInit, OnDestroy } from '@angular/core';
import { DigestoService } from 'src/app/shared/services/digesto.service';
import { Observable, Subject, of } from 'rxjs';
import { FormGroup, FormBuilder } from '@angular/forms';
import { mergeMap, switchMap } from 'rxjs/operators';
import { NavegarService } from 'src/app/core/navegar.service';

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

  columnas_ = ['numero','tipo','fecha','emisor','archivo','visibilidad'];
  filters: FormGroup = null;
  normas$: Observable<any[]> = null;
  estados$: Observable<any[]> = null;
  mostrarFiltros:boolean=false;

  buscar$ = new Subject<void>();

  columnas() {
    return this.columnas_;
  }

  constructor(
          private service: DigestoService,
          private fb: FormBuilder,
          private navegar: NavegarService) { 

    let mes_milis = 1000 * 60 * 60 * 24 * 30;
    this.filters = this.fb.group({
      'desde':[new Date((new Date()).getTime() - mes_milis)],
      'hasta':[new Date()],
      'texto':[''],
      'estado':['Todas']
    });

    this.normas$ = this.buscar$.pipe(
      switchMap( _ => {
        let desde = this.desde;
        let hasta = this.hasta;
        let estado = this.estado;
        let texto = this.texto;
        return this.service.obtener_normas(desde, hasta, estado, texto);
      })
    )

    this.estados$ = of(['Todas','Pendientes','Aprobadas']);
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

  ngOnInit() {
  }





}
