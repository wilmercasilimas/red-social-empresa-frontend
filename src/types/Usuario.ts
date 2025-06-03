export type Usuario = {
  _id: string;
  nombre: string;
  apellidos: string;
  email: string;
  cargo: string;
  area: {
    _id: string;
    nombre: string;
    descripcion?: string;
  } | null;
  rol: string;
  imagen?: string;
  activo?: boolean;
  fecha_ingreso?: string; // ISO string (ej. "2025-06-01T15:00:00.000Z")
  creado_en?: string;

  incidencias_activas?: {
    tipo: string;
    fecha_inicio: string;
    fecha_fin: string;
  }[]; // Fecha de creación automática
};
