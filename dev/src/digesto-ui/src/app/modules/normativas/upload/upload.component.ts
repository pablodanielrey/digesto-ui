import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Observable, of } from 'rxjs';
import { Emisor, Tipo } from 'src/app/shared/entities/digesto';
import { DigestoService } from 'src/app/shared/services/digesto.service';



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

  form: FormGroup;
  emisores$ : Observable<Emisor[]> = null;
  tipos$: Observable<Tipo[]> = null;

  constructor(
          private fb: FormBuilder, 
          private service: DigestoService) { 

    this.form = fb.group({
      'numero': [''],
      'extracto': [''],
      'fecha': [new Date()],
      'tipo': [''],
      'emisor': [''],
      'estado': fb.group({
        'aprobado': [true],
        'pendiente': [false]
      }),
      'archivo': [[]]
    });

    this.emisores$ = this.service.obtener_emisores();
    this.tipos$ = this.service.obtener_tipos();
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
    this.form.get('archivo').value.forEach(a => {
      archivos.push({
        name: a.archivo.name,
        size: a.archivo.size,
        type: a.archivo.type,
        lastModified: a.archivo.lastModifiedDate,
        contenido: a.contenido
      })
    }) 


    let v = this.estado.get('aprobado').value ? true : false;
    let norma = {
      'numero': this.form.get('numero').value,
      'extracto': this.form.get('extracto').value,
      'fecha': this.form.get('fecha').value,
      'tipo': this.form.get('tipo').value,
      'emisor': this.form.get('emisor').value,
      'visible': v,
      'archivo': archivos.length > 0 ? archivos[0] : null
    }

    this.subscriptions.push(this.service.subir_norma(norma).subscribe(e => {
      if (e.status == 500) {
        console.log('error subiendo norma');
      } else {
        console.log('norma subida ok');
        this.form.reset();
      }
    }));
  }

}
