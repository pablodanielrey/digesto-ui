import { Component, OnInit, OnDestroy, NgZone } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Observable, of, BehaviorSubject } from 'rxjs';
import { Emisor, Tipo } from 'src/app/shared/entities/digesto';
import { DigestoService } from 'src/app/shared/services/digesto.service';
import { ModalService } from 'src/app/core/modal/modal.service';



@Component({
  selector: 'app-upload',
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.scss']
})
export class UploadComponent implements OnInit, OnDestroy {

  subscriptions = [];

  ngOnDestroy(): void {
    this.subscriptions.forEach(s => s.unsubscribe());
  }

  cargando$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  form: FormGroup;
  emisores$ : Observable<Emisor[]> = null;
  tipos$: Observable<Tipo[]> = null;
  estados$: Observable<string[]> = null;

  constructor(
          private fb: FormBuilder, 
          private service: DigestoService,
          private modal: ModalService,
          private zone: NgZone) { 

    this.form = fb.group({
      'numero': [''],
      'fecha': [],
      'tipo': [''],
      'emisor': [''],
      'estado': [''],
      /*
      'estado': fb.group({
        'aprobado': [true],
        'pendiente': [false]
      }),
      */
      'archivo': [[]]
    });

    this.emisores$ = this.service.obtener_emisores();
    this.tipos$ = this.service.obtener_tipos();
    this.estados$ = of(['Pendiente','Aprobada']);

    // obtengo las normativas cargadas dentro de esta semana para deducir el número de norma a usar.
    this.subscriptions.push(this.service.obtener_metadatos().subscribe(m => {
      this.form.get('numero').setValue(m['numero_norma']);
      /*
      let datos = {
        'numero': m['numero_norma']
      }
      this.form.patchValue(datos);
      */
    }))
  }

  get tipo() {
    return this.form.get('tipo') as FormGroup;
  }

  get estado() {
    return this.form.get('estado') as FormGroup;
  }

  ngOnInit() {
  }

  subir() {
    console.log('subiendo');
    console.log(this.form.value);

    let archivos = [];
    let aux = this.form.get('archivo').value
    if (aux == null) {
      this.subscriptions.push(this.modal.openErrorModal('Debe subir algún archivo').subscribe(_ => {
        // nada;
      }));
      return;
    }
    aux.forEach(a => {
      archivos.push({
        name: a.archivo.name,
        size: a.archivo.size,
        type: a.archivo.type,
        lastModified: a.archivo.lastModifiedDate,
        contenido: a.contenido
      })
    }) 


    //let v = this.estado.get('aprobado').value ? true : false;
    let v = this.form.get('estado').value == 'Aprobada' ? true : false;
    let norma = {
      'numero': this.form.get('numero').value,
      //'extracto': this.form.get('extracto').value,
      'fecha': this.form.get('fecha').value,
      'tipo': this.form.get('tipo').value,
      'emisor': this.form.get('emisor').value,
      'visible': v,
      'archivo': archivos.length > 0 ? archivos[0] : null
    }

    this.zone.run(() => { this.cargando$.next(true); })
    this.subscriptions.push(this.service.subir_norma(norma).subscribe(e => {
      this.zone.run(() => { this.cargando$.next(false); })
      if (e.status == 500) {
        console.log('error subiendo norma');
        this.subscriptions.push(
          this.modal.openErrorModal('Error creando norma').subscribe(_ => {
            // nada;
          })
        )
      } else {
        console.log('norma subida ok');
        this.subscriptions.push(this.modal.openInfoModal('Crando Norma', 'Norma creada existosamente').subscribe(_ => {
          let numero = this.form.get('numero').value;
          this.form.reset();
          this.form.get('numero').setValue(numero + 1);
        }));
      }
    }));
  }

}
