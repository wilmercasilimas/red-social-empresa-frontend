import type { Usuario } from "./Usuario";

export interface Comentario {
  _id: string;
  contenido: string;
  autor: Usuario;
  publicacion: string;
  creado_en: string;
}