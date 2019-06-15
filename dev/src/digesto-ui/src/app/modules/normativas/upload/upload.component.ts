import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Observable, of } from 'rxjs';
import { Emisor } from 'src/app/shared/entities/emisor';
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

  constructor(
          private fb: FormBuilder, 
          private service: DigestoService) { 

    this.form = fb.group({
      'numero': [''],
      'extracto': [''],
      'fecha': [new Date()],
      'tipo': fb.group({
        'disposicion': [false],
        'ordenanza': [false],
        'resolucion': [false]
      }),
      'emisor': [''],
      'estado': fb.group({
        'aprobado': [true],
        'pendiente': [false]
      }),
      'archivo': [[]]
    });

    this.emisores$ = this.service.obtener_emisores();
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

    let archivos = this.form.get('archivo').value;
    let t = this.tipo.get('disposicion').value ? 'disposicion' : (this.tipo.get('ordenanza').value ? 'ordenanza' : (this.tipo.get('resolucion').value ? 'resolucion' : ''));
    let e = this.estado.get('aprobado').value ? 'aprobado' : 'pendiente';
    let norma = {
      'numero': this.form.get('numero').value,
      'extracto': this.form.get('extracto').value,
      'tipo': t,
      'emisor': this.form.get('emisor').value,
      'estado': e,
      'archivo': archivos.length > 0 ? archivos[0] : null
    }

    this.subscriptions.push(this.service.subir_norma(norma).subscribe(e => {
      console.log('norma subida ok');
      this.form.reset();
    }));
  }

}
