import { Component, OnInit, OnDestroy } from '@angular/core';
import { DigestoService } from 'src/app/shared/services/digesto.service';
import { Observable, Subject } from 'rxjs';
import { FormGroup, FormBuilder } from '@angular/forms';
import { mergeMap } from 'rxjs/operators';
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

  filters: FormGroup = null;
  normas$: Observable<any[]> = null;
  buscar$ = new Subject<void>();

  constructor(
          private service: DigestoService,
          private fb: FormBuilder,
          private navegar: NavegarService) { 

    this.filters = this.fb.group({
      'desde':[new Date()],
      'hasta':[new Date()]
    });

    this.normas$ = this.buscar$.pipe(
      mergeMap( _ => {
        let desde = this.desde;
        let hasta = this.hasta;
        return this.service.obtener_normas(desde, hasta);
      })
    )
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
