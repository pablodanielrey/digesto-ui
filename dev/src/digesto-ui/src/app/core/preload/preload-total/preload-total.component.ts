import { Component, OnInit } from '@angular/core';
import { Subject } from 'rxjs';

import { PreloadService } from '../preload.service';

@Component({
  selector: 'app-preload-total',
  templateUrl: './preload-total.component.html',
  styleUrls: ['./preload-total.component.scss']
})
export class PreloadTotalComponent implements OnInit {

  activo$: Subject<boolean>;

  constructor(private service:PreloadService) { 
    this.activo$ = service.obtener_preload_completo();
  }
  ngOnInit() {
  }

}
