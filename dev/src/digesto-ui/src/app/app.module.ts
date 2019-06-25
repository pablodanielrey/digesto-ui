import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';

import { MatPaginatorModule, MAT_DATE_LOCALE } from '@angular/material';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CoreModule } from './core/core.module';

import { AdjuntarArchivosComponent } from './shared/components/adjuntar-archivos/adjuntar-archivos.component';

import { InicioComponent } from './modules/inicio/inicio.component';
import { UploadComponent } from './modules/normativas/upload/upload.component';
import { ListaComponent } from './modules/normativas/lista/lista.component';
import { DetalleComponent } from './modules/normativas/detalle/detalle.component';

import { ListaComponent as ListaPublicaComponent } from './modules/publico/lista/lista.component';

@NgModule({
  declarations: [
    AdjuntarArchivosComponent,
    AppComponent,
    InicioComponent,
    UploadComponent,
    ListaComponent,
    DetalleComponent,
    ListaPublicaComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production }),
    BrowserAnimationsModule,
    ReactiveFormsModule,
    MatPaginatorModule,
    CoreModule
  ],
  providers: [
    {provide: MAT_DATE_LOCALE, useValue: 'es-AR'}
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
