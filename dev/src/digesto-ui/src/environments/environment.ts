// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  loginApiUrl: 'https://api.econo.unlp.edu.ar/login/api/v1.0',
  wardenApiUrl: 'https://api.econo.unlp.edu.ar/warden/api/v1.0',
  oidp_issuer: 'https://oidc.econo.unlp.edu.ar/',
  digestoApiUrl: 'http://163.10.17.13:11302/digesto/api/v1.0',
  //digestoApiUrl: 'http://localhost:11302/digesto/api/v1.0',

  client_id: 'digesto-ui',
  version: '0.0.1a',

  loader: {
    cabecera: 'DIGESTO | FCE',
    version: '0.0.1a',
    tituloSistema: 'DIGESTO',
    subtituloSistema: '',
    desarrolloSistema: 'DiTeSI | Dirección de Tecnologías y Sistemas Informáticos',
    logoSistema: '/assets/img/fce/logofce2018.png',
  }    

};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
