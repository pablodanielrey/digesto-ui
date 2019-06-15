import { Injectable } from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';

import { Observable, of, interval } from 'rxjs';
import { map, reduce, catchError, mergeMap, throttle } from 'rxjs/operators';

import { environment } from '../../environments/environment';


const WARDEN_API_URL = environment.wardenApiUrl;

interface Response {
  status: number,
  description: string,
  result: boolean,
  granted: string[]
}

interface Permission {
  status: number,
  expire: number,
  granted: boolean
}

@Injectable({
  providedIn: 'root'
})
export class PermisosService {

  expire_error = 10 * 1000;   // 10 segundos para los permisos cuando existe error.
  expire_ok = 60 * 60 * 24 * 1000; // 10 minutos para los permisos correctamente retornados

  constructor(private http: HttpClient) { 
  }

  _set(perm) {
    let permisoConcedido:Permission = {
      status: 200,
      expire: new Date().getTime() + this.expire_ok,
      granted: true
    }
    localStorage.setItem(perm, JSON.stringify(permisoConcedido));
  }

  _deny(perm) {
    let permisoConcedido:Permission = {
      status: 200,
      expire: new Date().getTime() + this.expire_ok,
      granted: false
    }
    localStorage.setItem(perm, JSON.stringify(permisoConcedido));
  }

  _delete(perm) {
    localStorage.removeItem(perm);
  }

  _inCache(perm) {
    return (localStorage.getItem(perm) != null);
  }

  has(perms:string[]): Observable<boolean> {
    /*
      chequea que la persona tenga todos los permisos consultados.
    */
    let retorno: boolean = true;

    // chequeo que permisos existen en la cache
    let ahora = new Date().getTime();
    let toCheck = [];
    perms.forEach(p => {
      let sp = localStorage.getItem(p);
      if (sp == null) {
        toCheck.push(p);
      } else {
        let ssp:Permission = JSON.parse(sp);
        if (ssp.expire <= ahora) {
          localStorage.removeItem(sp);
          toCheck.push(p);
        } else {
          retorno = retorno && ssp.granted;
        }
      }
    });

    // si ya tengo el resultado o si no hay que consultar ninguno entonces retorno el resultado de la cache
    if (!retorno || toCheck.length <= 0) {
      return of(retorno);
    }

    // consulto los permisos faltantes al servidor.
    let origen$ = of(toCheck);
    let apiUrl = `${WARDEN_API_URL}/has_permissions`;
    let data = {
      'permissions':toCheck
    };
    let consulta$ = this.http.post<Response>(apiUrl, data).pipe(
        catchError(e => {
          console.log(e);
          return of({status:500, description:e, result: false, granted:[]});
        }))

    return origen$.pipe(
      mergeMap(toCheck => {
        return consulta$.pipe(
          map(
            r => {
              if (r.status != 200) {
                // error de servidor : uso cache negativo para no matarlo.
                let expira = new Date().getTime() + this.expire_error;
                toCheck.forEach(p => {
                  let permisoNegado:Permission = {
                    expire: expira,
                    granted: false,
                    status: r.status
                  }
                  localStorage.setItem(p, JSON.stringify(permisoNegado));
                });
                return false;
              }
  
              // si el servidor retorno correctamente entonces seteo en la cache los concedidos.
              let permisoConcedido:Permission = {
                status: r.status,
                expire: new Date().getTime() + this.expire_ok,
                granted: true
              }
              r.granted.forEach(p => {
                localStorage.setItem(p, JSON.stringify(permisoConcedido));
              });
              return r.result;
            }
          )
        )
      })
    );
  }
}
/*
export class PermisosService {

  expire_error = 10 * 1000;   // 10 segundos para los permisos cuando existe error.
  expire_ok = 60 * 10 * 1000; // 10 minutos para los permisos correctamente retornados

  constructor(private http: HttpClient) { 
  }

  _save_example() {
    let permissions = {
      status: 200,
      expire: new Date().getTime() + this.expire_ok,
      granted: ['urn:*:*:*']
    }
    localStorage.setItem('permissions', JSON.stringify(permissions));
  }

  _load_perms(): Observable<string[]> {
    let perms = localStorage.getItem(`permissions`);
    if (perms != null) {
      let permissions = JSON.parse(perms);
      if (permissions.expire > new Date().getTime()) {
        return of(permissions.granted);
      }
    } 
    let apiUrl = `${WARDEN_API_URL}/permissions`;
    return this.http.get<response>(apiUrl).pipe(
      catchError(e => {
        console.log(e);
        return of({status:500, expire:0, granted:[]});
      }), 
      map(
        r => {
          let permissions = {
            status: r.status,
            expire: new Date().getTime() + this.expire_ok,
            granted: r.granted
          }
          if (permissions.status != 200) {
            permissions.granted = [];
            permissions.expire = new Date().getTime() + this.expire_error;
          }
          localStorage.setItem(`permissions`,JSON.stringify(permissions));
          return permissions.granted;
        }
      )
    );
  }

  _matches(p:string, perm:string) {
    let perms = perm.split(':');
    let system = perms[1];
    let r = perms[2];
    let action = perms[3];

    let toCheck = p.split(':')
    if (system == '*' || system == toCheck[1]) {
      if (r == '*' || r == toCheck[2]) {
        if (action == '*' || action == toCheck[3]) {
          if (perms.length <= 4) {
            return true;
          } else {
            let scope = perms[4];
            if (toCheck.length > 4 && scope == toCheck[4]) {
              return true;          
            }
          }
          
        }
      }
    }
    return false;
  }

  has(p:string): Observable<boolean> {
    return this._load_perms().pipe(map(
      ps => {
        for (let perm of ps) {
          if (this._matches(p,perm)) {
            return true;
          }
        }
        return false;
      }
    ));
  }

  all(ps:string[]): Observable<boolean> {
    return this._load_perms().pipe(map(
      perms => {
        for (let p of ps) {
          let r = false;
          for (let perm of perms) {
            if (this._matches(p,perm)) {
              r = true;
              break;
            }
          }
          if (!r) {
            return false;
          }
        }
        return true;
      }
    ));
  }

  any(ps:string[]): Observable<boolean> {
    return this._load_perms().pipe(map(
      perms => {
        for (let p of ps) {
          for (let perm of perms) {
            if (this._matches(p,perm)) {
              return true;
            }
          }
        }
        return false;
      }
    ));
  }
}
*/
