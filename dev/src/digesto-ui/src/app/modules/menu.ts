import { MenuSistema } from '../core/sistema/types';
  
export const menu : MenuSistema = [
    { item: 'Normativas', menu: null, ruta: '/sistema/normativas/administrar', icono: 'filter_1', permisos: ['urn:digesto:normativas'] },
    { item: 'Menu Oculto', menu: null, ruta: '/sistema/movimientos/pendientes', icono: 'notifications_none', permisos: ['urn:sileg:administrador:read'] }
];