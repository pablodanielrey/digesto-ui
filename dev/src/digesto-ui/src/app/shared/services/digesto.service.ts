import { Injectable } from '@angular/core';
import { Emisor } from '../entities/emisor';
import { Observable, of } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';




export interface Estado {
  status: number,
  data: any
}

@Injectable({
  providedIn: 'root'
})
export class DigestoService {

  constructor(private http: HttpClient) { }

  obtener_emisores(): Observable<Emisor[]> {
    return of([{ id: '1', nombre: 'decanato' }, { id: '2', nombre: 'secretaria académica'}]);
  }

  subir_norma(norma: any): Observable<any> {
    let url = 'http://localhost:11302/digesto/api/v1.0/norma';
    let data = norma;
    let req = this.http.post(url, data).pipe(
      map((res: Response) => {
        return res.json;
      })
    );
    return req;
  }

}
