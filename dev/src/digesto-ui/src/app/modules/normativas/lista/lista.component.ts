import { Component, OnInit } from '@angular/core';
import { DigestoService } from 'src/app/shared/services/digesto.service';
import { Observable, Subject } from 'rxjs';
import { FormGroup, FormBuilder } from '@angular/forms';
import { mergeMap } from 'rxjs/operators';

@Component({
  selector: 'app-lista',
  templateUrl: './lista.component.html',
  styleUrls: ['./lista.component.scss']
})
export class ListaComponent implements OnInit {

  filters: FormGroup = null;
  normas$: Observable<any[]> = null;
  buscar$ = new Subject<void>();

  constructor(
          private service: DigestoService,
          private fb: FormBuilder) { 

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

  ngOnInit() {
  }



}
