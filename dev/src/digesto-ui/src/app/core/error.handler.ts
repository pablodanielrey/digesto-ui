import { ErrorHandler, Injectable, Injector, NgZone } from '@angular/core';
//import { LocationStrategy, PathLocationStrategy } from '@angular/common';
import { MatSnackBar, MatSnackBarRef } from '@angular/material';
//import { LoggingService } from '../services';
//import * as StackTrace from 'stacktrace-js';

@Injectable()
export class GlobalErrorHandler implements ErrorHandler {

    constructor(private injector: Injector) { }

    handleError(error) {
      let zone = <NgZone>this.injector.get(NgZone);
      const snack = this.injector.get(MatSnackBar);
      let ref = snack.open(error.message,'Cerrar');
      ref.onAction().subscribe(() => {
        zone.run(() => {
          ref.dismiss();
        });
      });
  }

}
