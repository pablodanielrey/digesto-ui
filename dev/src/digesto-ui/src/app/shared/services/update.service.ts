import { Injectable } from '@angular/core';
import { SwUpdate, SwPush } from '@angular/service-worker';
import { ModalService } from 'src/app/core/modal/modal.service';

@Injectable({
  providedIn: 'root'
})
export class UpdateService {

  constructor(private update: SwUpdate, private modal: ModalService) { 
    this.update.available.subscribe(event => {
      this.modal.openInfoModal('Actualización', 'Se ha encontrado una nueva versión, actualizando el sistema.').subscribe(_ => {
        // nada  
      })
      this.update.activateUpdate().then(() => document.location.reload());
    });
  }

  checkForUpdate() {
    //this.notification.show('Asistencia', 'Chequeando actualizaciones');
    this.update.checkForUpdate().then(() => {
      //this.notification.show('Asistencia', 'Nueva versión existente');
    });
  }

}
