export interface Publicacion {
  _id: string;
  texto: string;
  imagen?: string | null;
  tarea: {
    _id: string;
    titulo: string;
  };
  autor: {
    _id: string;
    nombre: string;
    apellidos: string;
    email: string;
    imagen?: string;
  };
  creado_en: string; // ISO string
}
