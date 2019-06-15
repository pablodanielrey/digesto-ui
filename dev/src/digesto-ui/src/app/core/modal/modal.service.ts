import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material';
import { ErrorComponent } from './error/error.component'
import { Observable } from 'rxjs';
import { ConfirmComponent } from './confirm/confirm.component';
import { WarningComponent } from './warning/warning.component';
import { InfoComponent } from './info/info.component';

@Injectable({
  providedIn: 'root'
})
export class ModalService {

  constructor(
    public dialog: MatDialog
  ) { }

  openInfoModal(title: string, text: string) {
    const dialogRef = this.dialog.open(InfoComponent, {
      width: '300px',
      data: {title: title, text: text}
    })
    return dialogRef.afterClosed();    
  }

  openWarningModal(title: string, text: string) { 
    const dialogRef = this.dialog.open(WarningComponent, {
      width: '300px',
      data: {title: title, text: text}
    })
    return dialogRef.afterClosed();    
  }

  openErrorModal(err: string): Observable<any> { 
    const dialogRef = this.dialog.open(ErrorComponent, {
      width: '300px',
      data: err
    })
    return dialogRef.afterClosed();
  }

  openConfirmModal(title: string, text: string) {
    const dialogRef = this.dialog.open(ConfirmComponent, {
      width: '300px',
      data: {title: title, text: text}
    })
    return dialogRef.afterClosed();
  }  
}
