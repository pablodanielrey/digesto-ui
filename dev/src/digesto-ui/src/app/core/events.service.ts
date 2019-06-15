import { Injectable, NgZone } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class EventsService {

  events = new BehaviorSubject<any>(null);
  events_remote = new BroadcastChannel('core-eventos');


  constructor(private router:Router, private zone: NgZone) { 

    this.events_remote.onmessage = (e) => {
      let evento = e.data;
      this.zone.run(() => {
        this.events.next(evento);
      });
    }

  }

  enviar(tipo:string, datos:any) {
    let evento = {
      clase: 'unicast',
      tipo: tipo,
      datos: datos
    }
    this.events_remote.postMessage(evento);
  }

  broadcast(tipo:string, datos:any) {
    let evento = {
      clase: 'broadcast',
      tipo: tipo,
      datos: datos
    }
    this.events_remote.postMessage(evento);
  }

  obtener_cola() {
    return this.events;
  }

}
