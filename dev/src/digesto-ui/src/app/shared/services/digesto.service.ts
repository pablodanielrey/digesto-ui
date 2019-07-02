import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { HttpClient, HttpParams, HttpErrorResponse } from '@angular/common/http';
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

  obtener_metadatos(): Observable<any> {
    let url = `${API_URL}/metadatos`;
    let req = this.http.get(url).pipe(
      tap(v => console.log(v)),
      map(r => r['data'])
    )
    return req;
  }

  obtener_normas(desde:Date, hasta:Date, estado:string, texto:string): Observable<any[]> {
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
      hasta: hasta.toISOString(),
      estado: estado,
      texto: texto
    }
    let req = this.http.get(url, { params: params }).pipe(
      tap(v => console.log(v)),
      map(r => r['normas']),
      map(ns => { ns.forEach(e => {e.fecha = new Date(e.fecha); e.creada = new Date(e.creada)}); return ns; })
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
    let req = this.http.post(url, data).pipe(
      catchError(
      (err:HttpErrorResponse) => of({status: 500, data: err.message})
    ));
    return req;
  }

  obtener_archivo_url(archivo_id) {
    return `${API_URL}/archivo/${archivo_id}`;
  }


  cambiar_visibilidad(nid:string, visible:boolean): Observable<any> {
    let url = `${API_URL}/norma/${nid}`;
    /*
    let params = new HttpParams({
      fromObject: {
        desde: desde.toISOString(),
        hasta: hasta.toISOString()
      }
    });*/
    let body = {
      visible: visible
    }
    let req = this.http.put(url, body=body);
    return req;
  }

}
