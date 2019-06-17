import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { HttpClient, HttpParams } from '@angular/common/http';
import { map, tap, mergeMap, catchError } from 'rxjs/operators';
import { environment } from '../../../environments/environment';

import { Emisor, Tipo, Norma } from '../entities/digesto';

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
    let url = `${API_URL}/emisor`;
    let req = this.http.get(url).pipe(
      tap(v => console.log(v)),
      map(r => r['emisores'])
    )
    return req;
  }

  obtener_tipos(): Observable<any[]> {
    let url = `${API_URL}/tipo`;
    let req = this.http.get(url).pipe(
      tap(v => console.log(v)),
      map(r => r['tipos'])
    )
    return req;
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

  obtener_norma(id:string): Observable<Norma> {
    let url = `${API_URL}/norma/${id}`;
    let req = this.http.get(url).pipe(
      tap(v => console.log(v)),
      map(r => r['norma']),
      tap(v => console.log(v))
    )
    return req;
  }

  subir_norma(norma: any): Observable<any> {
    let url = `${API_URL}/norma`;
    let data = norma;
    let req = this.http.post(url, data);
    return req;
  }



}
