import { Component, OnInit, OnDestroy } from '@angular/core';
import { DigestoService } from 'src/app/shared/services/digesto.service';
import { Observable, Subject, of } from 'rxjs';
import { FormGroup, FormBuilder } from '@angular/forms';
import { mergeMap, switchMap } from 'rxjs/operators';
import { NavegarService } from 'src/app/core/navegar.service';
import { Router } from '@angular/router';

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
