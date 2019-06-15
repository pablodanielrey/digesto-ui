import { Component, OnInit } from '@angular/core';
import { Subject } from 'rxjs';

import { PreloadService } from '../preload.service';
 

@Component({
  selector: 'app-preload-parcial',
  templateUrl: './preload-parcial.component.html',
  styleUrls: ['./preload-parcial.component.scss']
})
export class PreloadParcialComponent implements OnInit {

  activo$: Subject<boolean>;

  constructor(private service:PreloadService) { 
    this.activo$ = service.obtener_preload_parcial();
  }

  ngOnInit() {
  }

}
