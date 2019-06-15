import { Injectable } from '@angular/core';
import { Emisor } from '../entities/emisor';
import { Observable, of } from 'rxjs';


export interface Estado {
  status: number,
  data: any
}

@Injectable({
  providedIn: 'root'
})
export class DigestoService {

  constructor() { }

  obtener_emisores(): Observable<Emisor[]> {
    return of([{ id: '1', nombre: 'decanato' }, { id: '2', nombre: 'secretaria académica'}]);
  }

  subir_norma(norma: any): Observable<Estado> {
    return of({status:200, data:{}});
  }

}
