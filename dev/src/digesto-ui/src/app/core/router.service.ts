import { Injectable } from '@angular/core';
import { EventsService } from './events.service';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class RouterService {

  constructor(private router: Router, private events:EventsService) { 
  }

  navegar(ruta) {
    this.events.broadcast('router',ruta);
  }

  subscribir() {
    return this.events.obtener_cola().subscribe(
      e1 => {
        if (e1 == null) {
          return;
        }
        if (e1.tipo == 'router') {
          let ruta = e1.datos;
          this.router.navigate([ruta]);
        }
      }
    )

  }
}
