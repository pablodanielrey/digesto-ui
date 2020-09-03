export const environment = {
  production: true,
  loginApiUrl: 'https://api.login.econo.unlp.edu.ar/login/api/v1.0',
  wardenApiUrl: 'https://api.warden.econo.unlp.edu.ar/warden/api/v1.0',
  oidp_issuer: 'https://oidc.econo.unlp.edu.ar/',
  digestoApiUrl: 'https://api.digesto.econo.unlp.edu.ar/digesto/api/v1.0',

  client_id: 'digesto-ui',
  version: '0.1.3',

  loader: {
    cabecera: 'DIGESTO | FCE',
    version: '0.1.3',
    tituloSistema: 'DIGESTO',
    subtituloSistema: 'Normativas de la Facultad de Ciencias Económicas',
    desarrolloSistema: 'DiTeSI | Dirección de Tecnologías y Sistemas Informáticos',
    logoSistema: '/assets/img/fce/logofce2018.png',
  }       
};
