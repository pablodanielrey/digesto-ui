import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DigestoService } from 'src/app/shared/services/digesto.service';
import { Observable, of } from 'rxjs';
import { Norma } from 'src/app/shared/entities/digesto';
import { map, mergeMap, switchMap } from 'rxjs/operators';

import { environment } from '../../../../environments/environment';

const API_URL = environment.digestoApiUrl;

@Component({
  selector: 'app-detalle',
  templateUrl: './detalle.component.html',
  styleUrls: ['./detalle.component.scss']
})
export class DetalleComponent implements OnInit {

  norma$: Observable<Norma> = null;

  constructor(
          private route: ActivatedRoute,
          private service: DigestoService) { 

    let params$ = route.paramMap.pipe(
      map(params => params.get('id'))
    )
    this.norma$ = params$.pipe(
      switchMap(nid => {
        return this.service.obtener_norma(nid);
      })
    )
  }

  archivoUrl(aid) {
    return `${API_URL}/archivo/${aid}`;
  }

  ngOnInit() {
  }

}
