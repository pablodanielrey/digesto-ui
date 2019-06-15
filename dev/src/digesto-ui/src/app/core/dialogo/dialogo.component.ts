import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-dialogo',
  templateUrl: './dialogo.component.html',
  styleUrls: ['./dialogo.component.scss']
})
export class DialogoComponent implements OnInit {

  mostrar_dialogo: boolean = false;

  @Input()
  set mostrar(b:boolean) {
    this.mostrar_dialogo = b;
  }
  get mostrar() {
    return this.mostrar_dialogo;
  }

  constructor() { }

  ngOnInit() {

  }

}
