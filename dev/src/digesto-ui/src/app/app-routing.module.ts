import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DebugComponent } from './core/debug/debug.component';
import { Oauth2Component } from './core/oauth2/oauth2.component';
import { LoaderComponent } from './core/loader/loader.component';
import { OidpGuard } from './core/oauth2/oidp.guard';
import { SistemaComponent } from './core/sistema/sistema.component';
import { InicioComponent } from './modules/inicio/inicio.component';
import { UploadComponent } from './modules/normativas/upload/upload.component';
import { ListaComponent } from './modules/normativas/lista/lista.component';
import { DetalleComponent } from './modules/normativas/detalle/detalle.component';




const routes: Routes = [

  { path: 'debug', component: DebugComponent },
  { path: 'oauth2', component: Oauth2Component }, 
  { path: 'loader', component: LoaderComponent }, 
  {
     path:'sistema',
     //canActivate: [OidpGuard],
     component: SistemaComponent,
     children: [
      { path: 'inicio', component: InicioComponent },
      { 
        path: 'normativas',
        children: [
          { path: 'cargar', component: UploadComponent },
          { path: 'listar', component: ListaComponent },
          { path: 'detalle', component: DetalleComponent }
        ]
      }
     ]
  },
  { path: '**', redirectTo: '/sistema/normativas/listar' }

];


@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
