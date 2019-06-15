import { Component, OnInit } from '@angular/core';
import { PreloadService } from '../preload/preload.service';
import { EventsService } from '../events.service';
import { FormGroup, FormControl } from '@angular/forms';
import { RouterService } from '../router.service';
import { PermisosService } from '../permisos.service';
import { Router, Route } from '@angular/router';

import { menu } from '../../modules/menu';
import { Observable, of, forkJoin, Subject, BehaviorSubject } from 'rxjs';
import { map, mergeMap, tap, filter, switchMap } from 'rxjs/operators';
import { ModalService } from '../modal/modal.service';

interface Permiso {
  item: string,
  permiso: string,
  checked: boolean,
  eliminado: boolean
}

@Component({
  selector: 'app-debug',
  templateUrl: './debug.component.html',
  styleUrls: ['./debug.component.scss']
})
export class DebugComponent implements OnInit {

  rutas: object[] = [];

  actualizar_permisos$ = new BehaviorSubject<void>(null);
  permisos_menu$: Observable<Permiso[]> = null;
  permisos_configurados$: Observable<Permiso[]> = null;
  permisos_faltantes$: Observable<Permiso[]> = null;
  permisos_denegados$: Observable<Permiso[]> = null;

  

  constructor(private preload: PreloadService, 
              private routerService: RouterService, 
              private permisos: PermisosService,
              private router: Router,
              private modalService: ModalService) { 
              

      this.permisos_menu$ = this.actualizar_permisos$.pipe(
        switchMap(v => of(menu)),
        map(menu => menu.map(item => 
          this.permisos.has(item.permisos).pipe(
            map(b => {
              let permiso = item.permisos.join(' ').replace(' ','');
              return {
                item: item.item,
                permiso: permiso,
                checked: b,
                eliminado: !this.permisos._inCache(permiso)
              }
            })  
          ))
        ),
        mergeMap(a => forkJoin(a)),
        tap(v => console.log(v))
      );
      
      this.permisos_configurados$ = this.permisos_menu$.pipe(
        map(menu => menu.filter(item => item.checked))
      );
      this.permisos_denegados$ = this.permisos_menu$.pipe(
        map(menu => menu.filter(item => !item.checked))
      );;
      this.permisos_faltantes$ = this.permisos_menu$.pipe(
        map(menu => menu.filter(item => item.eliminado))
      );;
      
  }

  ngOnInit() {
    this.procesar_rutas('', this.router.config);
    this.actualizar_permisos$.next();
  }

  private configurar_permiso(perm) {
    let permiso = perm.permiso;
    console.log('seteando permiso como retornado ok: ' + permiso);
    if (perm.checked) {
      this.permisos._deny(permiso);
    } else {
      this.permisos._set(permiso);
    }
    this.actualizar_permisos$.next();
  }

  private eliminar_permiso(perm) {
    this.permisos._delete(perm.permiso);
    this.actualizar_permisos$.next();
  }

  private procesar_rutas(parent:string, rs:Route[]) {
    rs.forEach(r => {
      if (r.children && r.children.length > 0) {
        this.procesar_rutas(parent + '/' + r.path, r.children);
      } else {
        this.rutas.push({path:parent + '/' + r.path});
      }
    });
  }

  activar_preload_parcial() {
    this.preload.activar_preload_parcial();
  }

  desactivar_preload_parcial() {
    this.preload.desactivar_preload_parcial();
  }  

  activar_preload_completo() {
    this.preload.activar_preload_completo();
  }

  desactivar_preload_completo() {
    this.preload.desactivar_preload_completo();
  }  


  form = new FormGroup({
    ruta: new FormControl('')
  })

  navegar() {
    this.routerService.navegar(this.form.value['ruta']);
  }

  openInfoModal() {
    this.modalService.openInfoModal("Info", "Modal info");
  }

  openWarningModal() {
    this.modalService.openWarningModal("Warning", "Modal Warning");
  }

  openErrorModal() {
    this.modalService.openErrorModal("Ha ocurrido un error");
  }

  openConfirmModal() {
    this.modalService.openConfirmModal("Modal con Confirmación", "Este es un modal con confirmación");
  }

}
