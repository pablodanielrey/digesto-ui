import { Injectable } from '@angular/core';
import { Emisor } from '../entities/emisor';
import { Observable, of } from 'rxjs';
import { HttpClient, HttpParams } from '@angular/common/http';
import { map, tap, mergeMap } from 'rxjs/operators';
import { environment } from '../../../environments/environment';

const API_URL = environment.digestoApiUrl;

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

  obtener_tipos(): Observable<any[]> {
    return of([])
  }

  obtener_normas(desde:Date, hasta:Date): Observable<any[]> {
    let url = `${API_URL}/norma`;
    /*
    let params = new HttpParams({
      fromObject: {
        desde: desde.toISOString(),
        hasta: hasta.toISOString()
      }
    });*/
    let params = {
      desde: desde.toISOString(),
      hasta: hasta.toISOString()
    }
    let req = this.http.get(url, { params: params }).pipe(
      tap(v => console.log(v)),
      map(r => r['normas'])
    )
    return req;
  }

  subir_norma(norma: any): Observable<any> {
    let url = `${API_URL}/norma`;
    let data = norma;
    let req = this.http.post(url, data).pipe(
      map((res: Response) => {
        return res.json;
      })
    );
    return req;
  }



}
