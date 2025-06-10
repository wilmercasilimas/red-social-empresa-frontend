export type EstadoTarea = 'pendiente' | 'en progreso' | 'completada';

export interface TareaBasica {
  _id: string;
  titulo: string;
}

export interface UsuarioTarea {
  _id: string;
  nombre: string;
  apellidos: string;
  email?: string;
}

export interface TareaCompleta extends TareaBasica {
  descripcion: string;
  estado: EstadoTarea;
  fecha_entrega?: string;
  creada_en: string;
  asignada_a: string | UsuarioTarea;

  creada_por: UsuarioTarea;
}
