import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Observable, of } from 'rxjs';


interface Emisor {
  nombre: string
}

@Component({
  selector: 'app-upload',
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.scss']
})
export class UploadComponent implements OnInit {

  form: FormGroup;
  emisores$ : Observable<Emisor[]> = null;

  constructor(private fb: FormBuilder) { 
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

    this.emisores$ = of([{ id: '1', nombre: 'decanato' }, { id: '2', nombre: 'secretaria académica'}]);
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
  }

}
