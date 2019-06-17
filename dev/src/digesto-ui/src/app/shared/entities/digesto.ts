
export interface Tipo {
  id: string,
  tipo: string
}

export interface Emisor {
  id: string,
  nombre: string
}

export interface Norma {
  id: string,
  numero: number,
  fecha: Date,
  extracto: string,
  visible: boolean,
  tipo: string,
  emisor: string,
  archivo_id: string
}